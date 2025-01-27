"use client";

import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
// import { useRouter } from "next/compat/router";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import styles from "./page.module.scss";

export default function Home() {
  const router = useRouter();

  // 페이지 생성 및 Supabase 연동 배열 데이터
  const onCreate = async () => {
    // Supabase 데이터 베이스 insert row 생성
    const { error, status } = await supabase
      .from("todos")
      .insert([
        {
          title: "",
          start_date: new Date(),
          end_date: new Date(),
          contents: [],
        },
      ])
      .select();

    if (error) {
      console.log(error);
    }

    console.log("status: ", status); // status:  201

    // 생성된 직후에 데이터 전달
    // 방금 생성한 TODO LIST의 ID 값으로 URL 생성/변경 -> Next.js 동적 라우팅(Dynamic Routing)
    let { data } = await supabase.from("todos").select(""); // 만든 데이터 불러오기기

    if (status === 201) {
      toast({
        title: "페이지 생성 완료!",
        description: "새로운 투두리스트가 생성 되었습니다!",
      });

      if (data) {
        router.push(`/create/${data[data?.length - 1].id}`); // supabase 동적라우팅 마지막 값을 불러오기
      } else return;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__onBoarding}>
        <span className={styles.container__onBoarding__title}>How To Start</span>
        <div className={styles.container__onBoarding__steps}>
          <span>1. create a page</span>
          <span>2. Add boards to page</span>
        </div>
        {/* 페이지 추가 버튼 / onClick={() => router.push("/create")} */}
        <Button variant="outline" className="w-full bg-transparent text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-500" onClick={onCreate}>
          Add New Page
        </Button>
      </div>
    </div>
  );
}
