import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "GRC Alumni Connect",
  description: "Columbia Global Research & Consulting — Alumni Network",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#F4F2EE]">
          <Navbar />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
