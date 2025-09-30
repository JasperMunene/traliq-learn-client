import type { Metadata } from "next";
import { Manrope, Poppins } from "next/font/google";
import "./globals.css";
import TokenRefreshProvider from "@/components/TokenRefreshProvider";

const manrope = Manrope({
  subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-geist-sans",
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-geist-mono",
})


export const metadata: Metadata = {
  title: "Traliq Ai - Learn Artificial Intelligence",
  description: "Master AI with expert-led courses, hands-on projects, and comprehensive learning resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.className} ${poppins.variable} antialiased`}
      >
        <TokenRefreshProvider>
          {children}
        </TokenRefreshProvider>
      </body>
    </html>
  );
}
