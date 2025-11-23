
// ... (بداية الملف كما هي)
import { dataService } from "@/lib/dataService"; // استيراد dataService

// ... (بقية تعريفات الواجهات والكود)

    io.on("connection", (socket) => {
      const authenticatedUser = (socket as any).user;
      console.log(`مستخدم معرّف (${authenticatedUser.id}) اتصل: ${socket.id}`);

      // ... (الأحداث الحالية مثل join-room, send-message)

      /**
       * معالج حدث حذف رسالة عامة للمشرفين
       */
      socket.on("delete-public-message", async (data: { messageId: number; roomId: string }) => {
        try {
          // dataService سيقوم بالتحقق من صلاحيات المشرف
          await dataService.deletePublicMessage(data.messageId, authenticatedUser.id);

          // إذا نجح الحذف، يتم إعلام جميع المستخدمين في الغرفة
          io.in(data.roomId).emit("message-deleted", { messageId: data.messageId });
          console.log(`المشرف ${authenticatedUser.id} حذف الرسالة ${data.messageId} من الغرفة ${data.roomId}`);

        } catch (error: any) {
          // إرسال خطأ إلى المشرف الذي طلب الحذف فقط
          socket.emit('error-message', { message: error.message });
          console.error(`فشل حذف الرسالة ${data.messageId}:`, error.message);
        }
      });

      // يمكنك إضافة معالجات مشابهة لـ delete-private-message و delete-wall-post هنا

      socket.on("disconnect", () => {
        delete userSocketMap[authenticatedUser.id];
        console.log(`المستخدم ${authenticatedUser.id} قطع الاتصال: ${socket.id}`);
      });

      /**
       * معالج حدث إعادة التشغيل الإجبارية للمشرفين
       */
      socket.on('force-reconnect', async () => {
        try {
          const { data: admin } = await supabase
            .from('users')
            .select('role')
            .eq('id', authenticatedUser.id)
            .single();

          if (admin?.role !== 'Super Admin') {
            throw new Error('غير مصرح لك.');
          }

          // بث حدث إعادة الاتصال لجميع المستخدمين
          io.emit('reconnect-now');
          console.log(`المشرف ${authenticatedUser.id} قام بتشغيل إعادة الاتصال الإجبارية.`);

        } catch (error: any) {
          socket.emit('error-message', { message: error.message });
        }
      });
    });
  }
  res.end();
}
