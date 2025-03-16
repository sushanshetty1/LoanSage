import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LoanSage",
  description: "LoanSage is an AI-powered loan management system.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          {/* Sticky Navbar */}
          <div className="sticky top-0 z-50">
            <Navbar />
          </div>
            <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
              {children}
            </div>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
