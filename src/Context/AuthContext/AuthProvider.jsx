import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useQueryClient } from "@tanstack/react-query";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth';
import { auth } from '../../Firebase/Firebase.init';

let googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();
    let [user, setUser] = useState(null);
    let [loading, setLoading] = useState(true);

    let googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    let registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    let signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    let signOutUser = async () => {
        setLoading(true);
        await signOut(auth);
        queryClient.clear();
        setUser(null);
        setLoading(false);
    };

    let updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile);
    };

    useEffect(() => {
        let unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    let authInfo = {
        user,
        loading,
        registerUser,
        signInUser,
        googleSignIn,
        signOutUser,
        updateUserProfile,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
