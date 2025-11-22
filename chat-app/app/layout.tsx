
import "./globals.css";

export const metadata = {
  title: "Chat App",
  description: "Real-time chat application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
