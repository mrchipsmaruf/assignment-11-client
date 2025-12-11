import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../Firebase/Firebase.init';


let googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {

    let [user, setUser] = useState(null);
    let [loading, setLoading] = useState(true);

    let googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
    }

    let registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    let signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    let signOutUser = () => {
        setLoading(true);
        return signOut(auth)
    }

    let updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile)
    }

    useEffect(() => {
        let unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        })
        return () => {
            unsubscribe();
        }
    }, [])

    let authInfo = {
        user,
        loading,
        registerUser,
        signInUser,
        googleSignIn,
        signOutUser,
        updateUserProfile,

    }

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;