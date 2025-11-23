
import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// تعريفات الواجهات كما هي
interface SocketServer extends HTTPServer {
  io?: Server;
}
interface SocketWithIO extends NetSocket {
  server: SocketServer;
}
interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

// مخزن مؤقت لربط هوية المستخدم بمقبس الاتصال
const userSocketMap: { [userId: string]: string } = {};

// دالة بسيطة لتنقية HTML ومنع XSS
const sanitizeHTML = (str: string): string => {
  return str.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
      default: return match;
    }
  });
};


export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    console.log("خادم السوكيت يعمل بالفعل.");
  } else {
    console.log("جاري تهيئة خادم السوكيت...");
    const io = new Server(res.socket.server, {
      path: "/api/socket_io",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    // Middleware للتحقق من هوية المستخدم قبل السماح بالاتصال
    io.use(async (socket, next) => {
      const token = socket.handshake.auth.token;

      if (token) {
          // ملاحظة: استخدام server-side client للتحقق من التوكن
          const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: () => new Map(Object.entries(req.cookies)) } // محاكاة الكوكيز
          );
          const { data: { user } } = await supabase.auth.getUser(token);

        if (user) {
          (socket as any).user = user; // إرفاق بيانات المستخدم إلى كائن السوكيت
          return next();
        }
      }
      // إذا لم يكن هناك توكن أو كان غير صالح، يتم رفض الاتصال
      next(new Error("مصادقة فاشلة"));
    });

    io.on("connection", (socket) => {
      const authenticatedUser = (socket as any).user;
      console.log(`مستخدم معرّف (${authenticatedUser.id}) اتصل: ${socket.id}`);

      // تسجيل المستخدم الموثوق به
      userSocketMap[authenticatedUser.id] = socket.id;

      socket.on("join-room", (roomId: string) => {
        // TODO: إضافة تحقق مستقبلي هنا للتأكد من صلاحية الانضمام للغرف الخاصة
        socket.join(roomId);
        console.log(`المستخدم ${socket.id} انضم للغرفة ${roomId}`);
      });

      socket.on("send-message", (data: { roomId: string; message: string }) => {
        const sanitizedMessage = sanitizeHTML(data.message);
        socket.broadcast.to(data.roomId).emit("new-message", {
          message: sanitizedMessage,
          sender_id: authenticatedUser.id
        });
      });

      socket.on("send-private-message", (data: { toUserId: string, content: string }) => {
        const recipientSocketId = userSocketMap[data.toUserId];
        if (recipientSocketId) {
          const sanitizedContent = sanitizeHTML(data.content);
          io.to(recipientSocketId).emit('private-message', {
            content: sanitizedContent,
            sender_id: authenticatedUser.id,
          });
        }
      });

      socket.on("disconnect", () => {
        delete userSocketMap[authenticatedUser.id];
        console.log(`المستخدم ${authenticatedUser.id} قطع الاتصال: ${socket.id}`);
      });
    });
  }
  res.end();
}
