
import { supabase } from './supabaseClient';

export const dataService = {
  async getOnlineUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', 'online');
    if (error) throw error;
    return data;
  },

  async getPublicRooms() {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('type', 'public');
    if (error) throw error;
    return data;
  },

  async createRoom(name: string, owner_id: string) {
    const { data, error } = await supabase
      .from('rooms')
      .insert([{ name, owner_id, type: 'public' }])
      .select();
    if (error) throw error;
    return data[0];
  },

  async getMessages(roomId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getPrivateMessages(userId: string) {
    const { data, error } = await supabase
      .from('private_messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  async sendPrivateMessage(sender_id: string, receiver_id: string, content: string) {
    const { data, error } = await supabase
      .from('private_messages')
      .insert([{ sender_id, receiver_id, content }])
      .select();
    if (error) throw error;
    return data[0];
  }
};
