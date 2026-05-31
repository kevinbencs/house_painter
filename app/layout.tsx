import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "./_components/footer/footer";
import HeaderContainer from "./_components/header/headerContainer";
import TopBar from "./_components/header/topbar";
import { IsLoggedProvider } from "./_components/loggedContext/isLoggedContext";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Budapesten szobafestés",
  description: "Megbíható, precíz szobafestés Budapesten és környékén",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <TopBar />
        <IsLoggedProvider>
          <HeaderContainer>{children}</HeaderContainer>
        </IsLoggedProvider>
        <Footer />
      </body>
    </html>
  );
}
