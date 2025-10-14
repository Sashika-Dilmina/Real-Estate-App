import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Account, Avatars, Client, OAuthProvider } from "react-native-appwrite";

// Appwrite configuration
export const config = {
  platform: "com.jsm.restate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
};

// Initialize Appwrite client
export const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

export const avatar = new Avatars(client);
export const account = new Account(client);

// Function to handle OAuth login
export async function login() {
  try {
    const redirectUri = Linking.createURL("/");
    console.log("Redirect URI:", redirectUri);
    
    // Generate OAuth2 token URL for Google
    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );

    if (!response) throw new Error("Failed to create OAuth2 token");

    // Open the auth session in browser
    const browserResult = await WebBrowser.openAuthSessionAsync(
      response.toString(),
      redirectUri
    );

    if (browserResult.type !== "success") throw new Error("Login cancelled");

    const url = new URL(browserResult.url);

    const secret = url.searchParams.get("secret");
    const userId = url.searchParams.get("userId");

    if (!secret || !userId) throw new Error("Missing auth parameters");

    // Create session using Appwrite
    const session = await account.createSession(userId, secret);

    if (!session) throw new Error("Failed to create a session");

    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}

export async function logout(){
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getCurrentUser() {
  try  {
    const response = await account.get();

    if(response.$id) {
      const userAvatar = avatar.getInitials(response.name);

      return {
         ... response,
         avatar: userAvatar.toString(),
      }
    }
    
  }catch (error) {
    console.error(error);
    return null;
  }
}