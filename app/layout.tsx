import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "GenZee Psychologist — Online Psychological Consultations",
    template: "%s | GenZee Psychologist",
  },
  description:
    "A welcoming space for honest conversations, personal growth, and psychological support — at your own pace. Book an online consultation today.",
  keywords: [
    "psychologist",
    "online therapy",
    "mental health",
    "consultation",
    "psychological support",
    "gen z therapy",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "GenZee Psychologist",
    title: "GenZee Psychologist — Online Psychological Consultations",
    description:
      "A welcoming space for honest conversations, personal growth, and psychological support.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GenZee Psychologist",
    description:
      "A welcoming space for honest conversations, personal growth, and psychological support.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable}`}
    >
      <body className="font-body bg-cream text-charcoal antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
