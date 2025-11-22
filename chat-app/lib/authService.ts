
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

// Mock implementation of authService
// This will be replaced with the real Supabase client when credentials are available.

// Mock user data for a successful sign-in
const mockUser = {
  id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  email: "test@example.com",
  user_metadata: { name: "Test User" },
  app_metadata: { provider: "email" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

const mockSession = {
  access_token: "mock_access_token",
  refresh_token: "mock_refresh_token",
  expires_in: 3600,
  token_type: "bearer",
  user: mockUser,
};

export const authService = {
  async signUp(credentials: SignUpWithPasswordCredentials) {
    console.log("Mock signUp called with:", credentials.email);
    // Simulate a successful sign-up
    return {
      user: { ...mockUser, email: credentials.email },
      session: mockSession,
    };
  },

  async signIn(credentials: SignUpWithPasswordCredentials) {
    console.log("Mock signIn called with:", credentials.email);
    // Simulate a successful sign-in
    if (credentials.password === "password") { // Simple check for mock
      return {
        user: { ...mockUser, email: credentials.email },
        session: mockSession,
      };
    }
    throw new Error("Invalid mock credentials");
  },

  async signOut() {
    console.log("Mock signOut called");
    // Simulate a successful sign-out
    return;
  },
};
