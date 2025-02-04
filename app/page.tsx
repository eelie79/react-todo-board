"use client"; // 클라이언트 컴포넌트 선언 (Next.js 13 이상에서 사용)

import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import { toast } from "@/hooks/use-toast";

export default function InitPage() {
  const router = useRouter();
  console.log(router);

  // 페이지 생성 및 Supabase 연동 배열 데이터
  const handleCreateTask = async () => {
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
    let { data } = await supabase.from("todos").select(); // 만든 데이터 불러오기기

    if (status === 201) {
      toast({
        title: "페이지 생성 완료!",
        description: "새로운 투두리스트가 생성 되었습니다!",
      });

      if (data) {
        router.push(`/task/${data[data?.length - 1].id}`); // supabase 동적라우팅 마지막 값을 불러오기
      } else return;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5 mb-6">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">How To Start</h3>
        <div className="flex flex-col items-center gap-3">
          <small className="text-sm font-normal leading-none">1. create a page</small>
          <small className="text-sm font-normal leading-none">2. Add boards to page</small>
        </div>
        {/* 페이지 추가 버튼 / onClick={() => router.push("/create")} */}
        <Button
          className="text-[#279057] bg-transparent border border-[#E79057] hover:bg-[#fff9F5] w-[180px]"
          // onClick={()=>{router.push{"/create"}}}
          onClick={handleCreateTask}>
          Add New Page
        </Button>
      </div>
    </div>
  );
}
