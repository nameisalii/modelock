import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const ModesContext = createContext();

export function useModes() {
  return useContext(ModesContext);
}

export function ModesProvider({ children }) {
  const { currentUser } = useAuth();
  const [modes, setModes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeMode, setActiveMode] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from local storage
  useEffect(() => {
    if (!currentUser) {
      setModes([]);
      setSessions([]);
      setLoading(false);
      return;
    }

    const storedModes = localStorage.getItem(`modeLock_modes_${currentUser.uid}`);
    if (storedModes) {
      setModes(JSON.parse(storedModes));
    }

    const storedSessions = localStorage.getItem(`modeLock_sessions_${currentUser.uid}`);
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }

    setLoading(false);
  }, [currentUser]);

  // Persist to local storage and sync with extension
  useEffect(() => {
    if (currentUser && !loading) {
      localStorage.setItem(`modeLock_modes_${currentUser.uid}`, JSON.stringify(modes));
      localStorage.setItem(`modeLock_sessions_${currentUser.uid}`, JSON.stringify(sessions));
      
      // Sync with extension
      if (typeof window !== 'undefined') {
        window.postMessage({ type: 'MODELOCK_SYNC_MODES', modes }, '*');
      }
    }
  }, [modes, sessions, currentUser, loading]);

  const createMode = useCallback(async (modeData) => {
    if (!currentUser) return;
    const newMode = {
      ...modeData,
      id: 'mode_' + Date.now(),
      userId: currentUser.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setModes(prev => [newMode, ...prev]);
    return Promise.resolve(newMode.id);
  }, [currentUser]);

  const updateMode = useCallback(async (modeId, updates) => {
    setModes(prev => prev.map(mode => 
      mode.id === modeId 
        ? { ...mode, ...updates, updatedAt: new Date().toISOString() } 
        : mode
    ));
    return Promise.resolve();
  }, []);

  const deleteMode = useCallback(async (modeId) => {
    setModes(prev => prev.filter(mode => mode.id !== modeId));
    return Promise.resolve();
  }, []);

  const duplicateMode = useCallback(async (mode) => {
    if (!currentUser) return;
    const newMode = {
      ...mode,
      id: 'mode_' + Date.now(),
      name: `${mode.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setModes(prev => [newMode, ...prev]);
    return Promise.resolve();
  }, [currentUser]);

  const startSession = useCallback(async (modeId) => {
    if (!currentUser) return;
    const session = {
      id: 'session_' + Date.now(),
      userId: currentUser.uid,
      modeId,
      startedAt: new Date().toISOString(),
      endedAt: null,
      blockedAttempts: 0,
      blockedSites: [],
      activeStatus: true
    };
    setSessions(prev => [session, ...prev]);
    setActiveMode(modeId);
    return Promise.resolve(session.id);
  }, [currentUser]);

  const endSession = useCallback(async (sessionId) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, endedAt: new Date().toISOString(), activeStatus: false }
        : session
    ));
    setActiveMode(null);
    return Promise.resolve();
  }, []);

  const value = {
    modes,
    sessions,
    activeMode,
    loading,
    createMode,
    updateMode,
    deleteMode,
    duplicateMode,
    startSession,
    endSession,
    setActiveMode
  };

  return (
    <ModesContext.Provider value={value}>
      {children}
    </ModesContext.Provider>
  );
}
