
import { supabase } from './supabaseClient';
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

export const authService = {
  async signUp(credentials: SignUpWithPasswordCredentials) {
    const { data, error } = await supabase.auth.signUp(credentials);
    if (error) throw error;
    return { user: data.user, session: data.session };
  },

  async signIn(credentials: SignUpWithPasswordCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return { user: data.user, session: data.session };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return;
  },

  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }
};
