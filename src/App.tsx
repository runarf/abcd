/** @jsx jsx */
import { FC, useState, useEffect } from 'react';
import { jsx, css } from '@emotion/core';
import 'firebase/auth';
import 'firebase/firestore';
import firebase, { User } from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/FirebaseAuth';
import { AbcdsTable } from './components/AbcdsTable';
import { AbcdForm } from './components/AbcdForm';
import { InfoSidebar } from './components/InfoSidebar';
import { Steps, Abcd } from './Types';

//import './App.css';

const firebaseConfig = {
  apiKey: 'AIzaSyCGq1TMToYxJ7M9xTjiZtv4qzv-bxXidRk',
  authDomain: 'abcd-629a4.firebaseapp.com',
  databaseURL: 'https://abcd-629a4.firebaseio.com',
  projectId: 'abcd-629a4',
  storageBucket: 'abcd-629a4.appspot.com',
  messagingSenderId: '650304935508',
  appId: '1:650304935508:web:8dc9ad5d0320cb44e5bfc1',
  measurementId: 'G-ZVYBVPDPK5',
};

firebase.initializeApp(firebaseConfig);

const SignIn: FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  const uiConfig: firebaseui.auth.Config = {
    autoUpgradeAnonymousUsers: true,
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // Use email link authentication and do not require password.
        // Note this setting affects new users only.
        // For pre-existing users, they will still be prompted to provide their
        // passwords on sign-in.
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        // Allow the user the ability to complete sign-in cross device, including
        // the mobile apps specified in the ActionCodeSettings object below.
        forceSameDevice: true,
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        console.log('signed in', authResult);
        return false;
      },
      signInFailure: async (error) => {
        if (error.code !== 'firebaseui/anonymous-upgrade-merge-conflict') {
          return;
        }
        var cred = error.credential;

        firebase.auth().signInWithCredential(cred);
      },
    },
  };

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        console.log('user signed in', user, firebase.auth().currentUser);
        setIsSignedIn(!!user);

        if (user !== null) {
          onLogin(user);
        }
      });
    return () => unregisterAuthObserver();
  }, []);

  return (
    <div>
      {!isSignedIn && (
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      )}
      {isSignedIn && (
        <div>
          <p>Welcome {firebase.auth().currentUser!.email}</p>
          <button onClick={() => firebase.auth().signOut()}>Sign out</button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [currentStep, setCurrentStep] = useState<Steps | null>(null);
  const [abcds, setAbcds] = useState<Abcd[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  if (!firebase) {
    throw Error('no firebase in app');
  }

  const getPath = () => {
    if (!currentUser) throw Error('No current user');
    return `users/${currentUser.uid}/abcds`;
  };

  useEffect(() => {
    if (!currentUser) return;
    const db = firebase.firestore();

    const listener = db.collection(getPath()).onSnapshot((snapshot) => {
      const docs = snapshot.docs;
      const abcds: Abcd[] = docs.map((doc) => doc.data() as Abcd);
      setAbcds(abcds);
    });

    return () => listener();
  }, [currentUser]);

  const handleOnRemove = async (abcd: Abcd) => {
    const db = firebase.firestore();

    try {
      const snapshot = await db
        .collection(getPath())
        .where('id', '==', abcd.id)
        .get();
      console.log(snapshot.docs);
      const abcdToDeleteRef = snapshot.docs[0];
      await db.collection(getPath()).doc(abcdToDeleteRef.id).delete();
    } catch (error) {
      console.log('delete error', error);
    }
  };

  const handleOnSubmit = async (abcd: Abcd) => {
    if (!currentUser) throw Error("Can't add abcd");

    try {
      const db = firebase.firestore();
      const docRef = await db.collection(getPath()).add(abcd);
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div
      css={css`
        height: 100vh;
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        grid-template-rows: 1fr 2fr 1fr;
        grid-template-areas:
          'header header header'
          'leftSidebar form sidebar'
          'leftSidebar table sidebar';
      `}
      className="App"
    >
      <div
        css={css`
          grid-area: header;
          display: flex;
          justify-content: center;
          background-color: #e85a4f;
        `}
      >
        <h1>ABCD</h1>
      </div>
      <div
        css={css`
          grid-area: leftSidebar;
          background-color: pink;
        `}
      >
        <SignIn onLogin={(user) => setCurrentUser(user)} />
      </div>
      <div
        css={css`
          width: 100%;
          grid-area: form;
          display: grid;
          background-color: #eae7dc;
        `}
      >
        <AbcdForm
          onSubmit={handleOnSubmit}
          onClickTextInput={(step) => {
            setCurrentStep(step);
          }}
          currentUser={currentUser}
        />
      </div>
      <div
        css={css`
          grid-area: table;
          width: 100%;
          background-color: #d8c3a5;
        `}
      >
        {currentUser ? (
          <AbcdsTable onRemove={handleOnRemove} abcds={abcds} />
        ) : null}
      </div>
      <div
        css={css`
          grid-area: sidebar;
          background-color: #8e8d8a;
        `}
      >
        <InfoSidebar currentStep={currentStep} />
      </div>
    </div>
  );
};

export default App;
