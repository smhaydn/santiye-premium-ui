import type { Metadata } from "next";
import { Open_Sans, Poppins, JetBrains_Mono } from "next/font/google"; // Import new fonts
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme-provider";
import { AssistantChat } from "@/components/shared/assistant-chat";

const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-sans" });
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-heading"
});
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Şantiye Yöneticisi v2.0 - Loft 777",
  description: "Modern Şantiye Yönetim Sistemi. Beton, demir, personel ve cari takibi tek platformda.",
  openGraph: {
    title: "Şantiye Yöneticisi v2.0",
    description: "Modern Şantiye Yönetim Sistemi",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.variable} ${poppins.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar (Desktop) */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* Top Header */}
              <Header />

              {/* Scrolling Page Content */}
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {children}
              </main>

              {/* AI Assistant Chatbot */}
              <AssistantChat />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
