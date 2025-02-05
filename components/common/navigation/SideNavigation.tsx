"use client";

// shadcn ui
import { Button, SearchBar } from "@/components/ui";
import { useCreateTask } from "@/hooks/apis";

export default function SideNavigation() {
  // 페이지 연동 및 Supabase 연동 - Task 생성 hooks 사용
  const handleCreateTask = useCreateTask();

  return (
    <aside className="page__aside">
      <div className="flex flex-col h-full gap-3">
        {/* 검색창 */}
        <SearchBar placeholder="검색어를 입력하세요" />
        {/* Add New Page 버튼 UI */}
        <Button className="text-[#E79057] bg-white border border-[#E79057] hover:bg-[#fff9f5]" onClick={handleCreateTask}>
          Add New Page
        </Button>
        {/* Task 목록 UI */}
        <div className="flex flex-col mt-4 gap-2">
          <small className="text-sm font-medium leading-none text-[#a6a6a6]">
            <span className="text-neutral-700">user Name</span>의 TASK
          </small>
          <ul className="flex flex-col">
            {/* Supabase에서 우리가 생성한 DB에 데이터가 없을 경우 */}
            <li className="bg-[#f5f5f5] min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm text-neutral-400">
              <div className="h-[6px] w-[6px] rounded-full bg-neutral-400"></div>
              등록된 Task가 없습니다.
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
