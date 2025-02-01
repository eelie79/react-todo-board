import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Roboto } from "next/font/google";
import "@/public/styles/globals.css";
// import "@/public/styles/main.scss";
import SideNavigation from "@/components/navigation/SideNavigation";

import { Toaster } from "@/components/ui/toaster";

// const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

const FONT_ROBOTO = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const NOTO_SANS_KR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "TODO-BOARD 만들기",
  description: "Shadcn UI 및 Supabase를 활용한 나만의 TODO-BOARD 만들기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body> // className={`antialiased`}*/}
      {/* <body className={`${NOTO_SANS_KR.className} antialiased`}> */}
      <body className={NOTO_SANS_KR.className}>
        <SideNavigation />
        {/* app 디렉토리에 있는 page.tsx에 정의된 컴포넌트 렌더링 */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
