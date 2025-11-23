
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
