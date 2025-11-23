
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { SocketProvider } from "@/lib/SocketContext";

export const metadata = {
  title: "شات سهر الخليج",
  description: "تطبيق دردشة في الوقت الفعلي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          <SocketProvider>{children}</SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
