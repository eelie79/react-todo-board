"use client";

// shadcn ui
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, SearchBar } from "@/components/ui";
import { useGetTasks, useCreateTask } from "@/hooks/apis";
import { Task, Board } from "@/types";

export function SideNavigation() {
  const router = useRouter();
  const { id } = useParams();
  const { tasks, getTasks } = useGetTasks();

  /*  getTasks는 컴포넌트 최초 렌더링시 한번만 호출 되어야 하므로 useEffect로 호출 */
  useEffect(() => {
    getTasks();
  }, [id]); // useParams id가 바뀌면 (리스트가 변경시) 호출

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
            <span className="text-neutral-700">user Name</span>의 TASKs
          </small>
          <ul className="flex flex-col">
            {tasks.length === 0 ? (
              <li className="bg-[#f5f5f5] min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm text-neutral-400">
                <div className="h-[6px] w-[6px] rounded-full bg-neutral-400"></div> 등록된 Task가 없습니다.
              </li>
            ) : (
              tasks.map((task: Task) => {
                return (
                  <li
                    key={task.id}
                    onClick={() => {
                      router.push(`/task/${task.id}`);
                    }}
                    className={`${task.id === Number(id) && "bg-[#f5f5f5]"} min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm cursor-pointer"`}>
                    <div className={`${task.id === Number(id) ? "bg-[#00f38d]" : "bg-neutral-400"} h-[6px] w-[6px] rounded-full`}></div>
                    <span className={`${task.id !== Number(id) && "text-neutral-400"}`}>{task.title ? task.title : "등록된 제목이 없습니다"}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
}
