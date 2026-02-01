
import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../components/LanguageProvider";
import { AuthProvider } from "../components/AuthProvider";
import { ToastProvider } from "../components/ui/Toast";
import GlobalErrorSuppressor from "../components/GlobalErrorSuppressor";

export const metadata: Metadata = {
  title: "TeraVolta - Smart Energy Solutions",
  description: "Strategic consulting, energy efficiency, and service quality solutions for homes and businesses in Panama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/images/logos/icon.png" />
      </head>
      <body
        className="antialiased"
        style={{
          color: '#333333',
          backgroundColor: '#FFFFFF'
        }}
        suppressHydrationWarning={true}
      >
        <GlobalErrorSuppressor />
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
