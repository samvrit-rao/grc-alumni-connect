import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "GRC Alumni Connect",
  description: "Columbia Global Research & Consulting — Alumni Directory",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-white">
          <Navbar />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
