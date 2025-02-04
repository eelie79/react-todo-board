import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/main.scss";

import SideNavigation from "@/components/navigation/SideNavigation";

import { Toaster } from "@/components/ui";

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

export const metadata: Metadata = {
  title: "TODO-TASK-BOARD 만들기",
  description: "Shadcn UI 및 Supabase를 활용한 나만의 TODO-BOARD 만들기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={NOTO_SANS_KR.className}>
        <div className="page">
          <SideNavigation />
          <div className="page__main">
            {/* app 디렉토리에 있는 page.tsx에 정의된 컴포넌트 렌더링 */}
            {children}
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
