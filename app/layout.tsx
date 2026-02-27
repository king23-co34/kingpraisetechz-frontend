import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/shared/Providers";

export const metadata: Metadata = {
  title: "King Praise Techz | Agency Dashboard",
  description: "Professional Web Agency Management Platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="noise-overlay mesh-bg min-h-screen antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(26,26,46,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f1f5f9",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                borderRadius: "12px",
              },
              success: {
                iconTheme: { primary: "#10b981", secondary: "#f1f5f9" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
