import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { User, UserRole } from '../types';
import { demoUsers } from '../data/dummyData';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  currentUser: User | null;
  currentRole: UserRole;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithSchoolAccount: (role: UserRole, identifier: string, pass?: string) => Promise<void>;
  switchRole: (role: UserRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pjok_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('pjok_role') as UserRole;
    return saved || 'SISWA';
  });
  const [loading, setLoading] = useState(true);

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Fetch or create user record in Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            const loadedUser: User = {
              id: user.uid,
              name: data.name || user.displayName || 'Pengguna PJOK',
              email: user.email || undefined,
              role: (data.role as UserRole) || 'GURU',
              avatar: user.photoURL || undefined,
            };
            setCurrentUser(loadedUser);
            setCurrentRole(loadedUser.role);
          } else {
            // Determine role: if email matches poerwanto2268@gmail.com, default to ADMIN
            const role: UserRole =
              user.email === 'poerwanto2268@gmail.com' ? 'ADMIN' : 'GURU';
            const newUser: User = {
              id: user.uid,
              name: user.displayName || 'Purwanto, S.Pd.',
              email: user.email || '',
              role,
              avatar: user.photoURL || undefined,
            };
            await setDoc(userDocRef, {
              uid: user.uid,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            setCurrentUser(newUser);
            setCurrentRole(newUser.role);
          }
        } catch (e) {
          console.warn('Could not sync user profile from Firestore:', e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pjok_user', JSON.stringify(currentUser));
      localStorage.setItem('pjok_role', currentUser.role);
    } else {
      localStorage.removeItem('pjok_user');
      localStorage.removeItem('pjok_role');
    }
  }, [currentUser]);

  // Google Login Popup
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  // Login with School Account (NISN / NIP / Email)
  const loginWithSchoolAccount = async (
    role: UserRole,
    identifier: string,
    _pass?: string
  ) => {
    // Demo user profile
    const demo = demoUsers[role];
    const loggedUser: User = {
      ...demo,
      name: identifier.length > 3 && !identifier.includes('009') ? identifier : demo.name,
    };
    setCurrentUser(loggedUser);
    setCurrentRole(role);

    // If authenticated in Firebase, sync to Firestore
    if (auth.currentUser) {
      try {
        await setDoc(
          doc(db, 'users', auth.currentUser.uid),
          {
            uid: auth.currentUser.uid,
            name: loggedUser.name,
            role: role,
            status: 'active',
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Sync school account error:', err);
      }
    }
  };

  // Switch role locally (available for testing/demonstration)
  const switchRole = (role: UserRole) => {
    const userToSwitch = demoUsers[role];
    setCurrentUser(userToSwitch);
    setCurrentRole(role);
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setCurrentUser(null);
    setCurrentRole('SISWA');
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        currentUser,
        currentRole,
        loading,
        loginWithGoogle,
        loginWithSchoolAccount,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
