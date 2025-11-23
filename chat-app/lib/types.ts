
// ملف مركزي لتعريفات الأنواع المشتركة في التطبيق

export type User = {
  id: string;
  avatar_url: string | null;
  name: string;
  country_flag: string | null;
  stars: number;
  custom_status: string | null;
  role?: 'Member' | 'Moderator' | 'Admin' | 'Guest' | 'Super Admin';
};

export type Room = {
  id: string;
  name: string;
  icon_url?: string | null;
  type?: 'public' | 'private';
  welcome_message?: string | null;
  owner_id?: string | null;
};

export type Message = {
  id: string; // أو number إذا كان من نوع BIGSERIAL
  room_id: string;
  sender_id: string;
  content: string;
  type?: 'text' | 'image' | 'file';
  created_at: string;
};

export type PrivateMessage = {
  id: string; // أو number
  sender_id: string;
  receiver_id: string;
  content: string;
  read_status: boolean;
  created_at: string;
};
