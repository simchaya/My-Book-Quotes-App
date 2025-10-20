// context/AuthContext.tsx (REACT NATIVE FIREBASE VERSION)
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Your Google Web Client ID
const GOOGLE_WEB_CLIENT_ID = '92079395989-54p9krn6t4kom39vihhm87fabcae1v3q.apps.googleusercontent.com';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
  });

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle Google Auth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken) {
        // Create Firebase credential from Google token
        const credential = GoogleAuthProvider.credential(authentication.idToken);
        
        // Sign in to Firebase with the credential
        signInWithCredential(auth, credential)
          .then((result) => {
            setUser(result.user);
            console.log('✅ Signed in:', result.user.email);
          })
          .catch((error) => {
            console.error('Firebase sign in error:', error.message);
          });
      }
    }
  }, [response]);

  const signIn = async () => {
    try {
      await promptAsync();
      // The actual sign-in happens in the useEffect above
    } catch (error: any) {
      console.error('Google sign in error:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      console.log('👋 Signed out');
    } catch (error: any) {
      console.error('Sign out error:', error.message);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};