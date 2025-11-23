
import { supabase } from './supabaseClient';

// دالة مساعدة للتحقق مما إذا كان المستخدم مشرفًا
const isAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return ['Admin', 'Super Admin'].includes(data.role);
};

export const dataService = {
  // --- الوظائف الحالية ---
  async getOnlineUsers() { /* ... */ },
  async getPublicRooms() { /* ... */ },
  async createRoom(name: string, owner_id: string) { /* ... */ },
  async getMessages(roomId: string) { /* ... */ },
  async getPrivateMessages(userId: string) { /* ... */ },
  async sendPrivateMessage(sender_id: string, receiver_id: string, content: string) { /* ... */ },

  // --- وظائف الحذف الجديدة ---

  /**
   * حذف رسالة من غرفة عامة. فقط للمشرفين.
   * @param messageId - معرف الرسالة المراد حذفها
   * @param adminId - معرف المستخدم الذي يقوم بعملية الحذف
   */
  async deletePublicMessage(messageId: number, adminId: string) {
    if (!(await isAdmin(adminId))) {
      throw new Error('غير مصرح لك بالقيام بهذا الإجراء.');
    }
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
    return true;
  },

  /**
   * حذف رسالة خاصة. فقط للمشرفين.
   * @param messageId - معرف الرسالة الخاصة
   * @param adminId - معرف المستخدم الذي يقوم بالحذف
   */
  async deletePrivateMessage(messageId: number, adminId: string) {
    if (!(await isAdmin(adminId))) {
      throw new Error('غير مصرح لك بالقيام بهذا الإجراء.');
    }
    const { error } = await supabase
      .from('private_messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
    return true;
  },

  /**
   * حذف منشور من الحائط. فقط للمشرفين.
   * @param postId - معرف المنشور
   * @param adminId - معرف المستخدم الذي يقوم بالحذف
   */
  async deleteWallPost(postId: number, adminId: string) {
    if (!(await isAdmin(adminId))) {
      throw new Error('غير مصرح لك بالقيام بهذا الإجراء.');
    }
    const { error } = await supabase
      .from('wall_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return true;
  },

  /**
   * حذف جميع الرسائل في غرفة عامة. فقط للمشرفين.
   * @param roomId - معرف الغرفة
   * @param adminId - معرف المستخدم الذي يقوم بالحذف
   */
  async deleteAllPublicMessagesInRoom(roomId: string, adminId: string) {
    if (!(await isAdmin(adminId))) {
      throw new Error('غير مصرح لك بالقيام بهذا الإجراء.');
    }
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('room_id', roomId);

    if (error) throw error;
    return true;
  },

  /**
   * يقوم بتصدير البيانات الأساسية (المستخدمين، الغرف، الإعدادات) كنسخة احتياطية.
   * @param adminId - معرف المستخدم الذي يقوم بالعملية (يجب أن يكون Super Admin)
   */
  async backupData(adminId: string) {
    // تحقق إضافي للتأكد من أنه Super Admin
    const { data: admin, error: adminError } = await supabase
      .from('users')
      .select('role')
      .eq('id', adminId)
      .single();

    if (adminError || admin?.role !== 'Super Admin') {
      throw new Error('فقط المدير الأعلى يستطيع القيام بهذه العملية.');
    }

    const [users, rooms, settings] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('rooms').select('*'),
      supabase.from('user_settings').select('*')
    ]);

    if (users.error || rooms.error || settings.error) {
      throw new Error('فشل في جلب بيانات النسخ الاحتياطي.');
    }

    return {
      backup_date: new Date().toISOString(),
      data: {
        users: users.data,
        rooms: rooms.data,
        user_settings: settings.data
      }
    };
  }
};
