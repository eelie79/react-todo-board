"use client"; // 클라이언트 컴포넌트 선언 (Next.js 13 이상에서 사용)

// shadcn ui
import { Button } from "@/components/ui";
import { useCreateTask } from "@/hooks/apis";

export default function InitPage() {
  // 페이지 생성 및 Supabase 연동 배열 데이터 -> TASK 생성
  const handleCreateTask = useCreateTask();

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
