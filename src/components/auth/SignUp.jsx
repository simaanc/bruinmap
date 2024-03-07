import React from 'react'
import { useState } from 'react';
import {auth, db} from '../../firebase.config';
import {createUserWithEmailAndPassword} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import { doc, collection, addDoc, setDoc, arrayUnion, updateDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

const SignUp = ()  => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userUid = userCredential.user.uid;
        // console.log(userCredential)
        console.log(userUid);
        const userDocRef = doc(db, 'events', userUid);
        return setDoc(userDocRef, {})
      }).then(() => {
        navigate('/')   // CHANGE TO PROTECTED ROUTE
      }).catch((error) => {
        console.log(error)
      });
  };
  return (
    <div className='sign-in-container'>
      <form onSubmit={signUp}>
        <h1>Create Account</h1>
        <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input type="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;