// hooks/useAuth.ts (Explicit proxy URI)

import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// Hardcode your Web Client ID here
const GOOGLE_WEB_CLIENT_ID = '92079395989-54p9krn6t4kom39vihhm87fabcae1v3q.apps.googleusercontent.com';

export const useAuth = () => {
    // Explicitly create the proxy redirect URI
    const redirectUri = AuthSession.makeRedirectUri({
        native: 'https://auth.expo.io/@simchacb/MyFirstApp',
    });
    
    console.log('Redirect URI:', redirectUri);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: GOOGLE_WEB_CLIENT_ID,
        redirectUri: redirectUri,
    });
    
    console.log('Request:', request);
    console.log('Response:', response);
      
    return { request, response, promptAsync };
};