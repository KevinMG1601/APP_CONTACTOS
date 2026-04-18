import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { getDb, getFirebaseAuth } from '../firebase/config';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { defaultProgress } from '../utils/missions';

type AuthCtx = {
  user: User | null;
  ready: boolean;
  displayName: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    let cancelled = false;
    void setPersistence(auth, browserLocalPersistence).catch(() => undefined);
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!cancelled) {
        setUser(u);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
    await updateProfile(cred.user, { displayName: name });
    const missions = defaultProgress();
    await setDoc(
      doc(getDb(), 'users', cred.user.uid),
      {
        uid: cred.user.uid,
        displayName: name,
        email,
        points: 0,
        missions,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }, []);

  const logOut = useCallback(async () => {
    await signOut(getFirebaseAuth());
  }, []);

  const displayName = useMemo(
    () => user?.displayName?.trim() || user?.email?.split('@')[0] || 'usuario',
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      ready,
      displayName,
      signIn,
      signUp,
      logOut,
    }),
    [user, ready, displayName, signIn, signUp, logOut]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useAuth(): AuthCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth solo dentro de AuthProvider');
  return v;
}
