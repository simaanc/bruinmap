import { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged } from 'firebase/auth';
import {auth, db} from '../firebase.config';
import { doc, collection, addDoc, setDoc, arrayUnion, updateDoc } from 'firebase/firestore';


const UserContext = createContext();

export const AuthContextProvider = ({children}) => {
  const [user, setUser] = useState({});


  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const userUid = userCredential.user.uid;
      //console.log(userCredential)
      //console.log(userUid);
      const userDocRef = doc(db, 'events', userUid);
      return setDoc(userDocRef, {})
    });
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

// createUserWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     const userUid = userCredential.user.uid;
    //     // console.log(userCredential)
    //     console.log(userUid);
    //     const userDocRef = doc(db, 'events', userUid);
    //     return setDoc(userDocRef, {})
    //   }).then(() => {
    //     navigate('/')   // CHANGE TO PROTECTED ROUTE
    //   }).catch((error) => {
    //     console.log(error)
    //   });

  const logout = () => {
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser)
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{createUser, user, logout, signIn}}>
      {children}
    </UserContext.Provider>
  )

  // const auth = getAuth();
  // const [user, setUser] = useState();

  // const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   let unsubscribe;
  //   unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setLoading(false) 
  //     if(currentUser) setUser(currentUser)
  //     else{setUser(null)}
  //   });
  //   return () => {
  //     if(unsubscribe) unsubscribe();
  //   }
  // },[])
  // const values = {
  //   user: user,
  //   setUser: setUser
  // }
  // return <Context.Provider value={values}>
  //   {!loading && 
  //     children
  //   }
  // </Context.Provider>
}

export const UserAuth = () => {
  return useContext(UserContext)
}