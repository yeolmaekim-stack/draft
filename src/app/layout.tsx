import type { Metadata } from "next";
import { Gothic_A1, Do_Hyeon } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const gothicA1 = Gothic_A1({
  variable: "--font-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

const doHyeon = Do_Hyeon({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "야근 메뉴 정해드림",
  description: "일만 해도 힘든데 뭐 먹을지까지 고민해야겠나요 - 야근 메뉴 추천 데모 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${gothicA1.variable} ${doHyeon.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
