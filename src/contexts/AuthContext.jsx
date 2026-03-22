import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('modeLock_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  function signup(email, password, name) {
    const newUser = {
      uid: 'user_' + Date.now(),
      email,
      displayName: name || email.split('@')[0],
      metadata: { creationTime: new Date().toISOString() },
      provider: 'local'
    };
    setCurrentUser(newUser);
    localStorage.setItem('modeLock_user', JSON.stringify(newUser));
    return Promise.resolve(newUser);
  }

  function login(email, password) {
    // For demo/hackathon purposes, ignore the password and login instantly
    const user = {
      uid: 'user_' + btoa(email),
      email,
      displayName: email.split('@')[0],
      metadata: { creationTime: new Date().toISOString() },
      provider: 'local'
    };
    setCurrentUser(user);
    localStorage.setItem('modeLock_user', JSON.stringify(user));
    return Promise.resolve(user);
  }

  function loginWithGoogle() {
    const user = {
      uid: 'google_' + Date.now(),
      email: 'demo@google.com',
      displayName: 'Demo User',
      metadata: { creationTime: new Date().toISOString() },
      provider: 'google'
    };
    setCurrentUser(user);
    localStorage.setItem('modeLock_user', JSON.stringify(user));
    return Promise.resolve(user);
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem('modeLock_user');
    return Promise.resolve();
  }

  function resetPassword(email) {
    console.log('Password reset requested for', email);
    return Promise.resolve();
  }

  const value = {
    currentUser,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
