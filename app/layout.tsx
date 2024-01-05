import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import WagmiConfig from "@/providers/wagmi-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pika Staking",
  description: "Pika Staking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chelsea+Market&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#efe4af]">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ?? ""}
        >
          <WagmiConfig>{children}</WagmiConfig>
        </GoogleOAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
