"use client";

import { useEffect, useState } from "react";
// shadcn ui
import { Dot, Search } from "lucide-react";
import { Button, Input, SearchBar } from "@/components/ui";
import { toast } from "@/hooks/use-toast";

import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { sidebarStateAtom } from "@/store";

// css
import styles from "./SideNavigation.module.scss";

export default function SideNavigation() {
  const router = useRouter();
  const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom);
  const [todos, setTodos] = useState<any>([]);

  // 페이지 연동 및 Supabase 연동
  const handleCreateTask = async () => {
    // console.log("사이드네비 함수 호출");

    // 사이드 좌메뉴 Supabase 데이터 row 새로운 데이터 생성
    const { error, status } = await supabase.from("todos").insert([
      {
        title: "",
        start_date: new Date(), // from
        end_date: new Date(), // to
        contents: [], // boards 배열
      },
    ]);

    if (error) {
      console.log(error);
    }

    // 생성완료 status code: 201
    if (status === 201) {
      // 성성완료 되면 스테이터스 코드 201번 넘어옮
      toast({
        title: "페이지 생성 환료!",
        description: "새로운 TO DO가 생성 되었습니다!",
      });

      // router.push("/create");
      let { data } = await supabase.from("todos").select("*");
      if (data) {
        router.push(`/task/${data[data?.length - 1].id}`);
        getTodos();
      }
    }
    // router.push("/create");
  };

  // Supabase에 기존에 생성된 페이지가 있는지도 체크(확인)
  const getTodos = async () => {
    let { data: todos, error, status } = await supabase.from("todos").select("*");

    setTodos(todos);
    return todos;
  };

  useEffect(() => {
    getTodos();
  }, [sidebarState]);

  return (
    // <div className={styles.container}>
    //   {/* 검색창 */}
    //   <div className={styles.container__searchBox}>
    //     {/* <Input type="text" placeholder="검색어를 입력해 주세요" className="focus-visible:ring-0" />
    //   <Button variant="outline" size="icon">
    //     <Search className="w-4 h-4" />
    //   </Button> */}
    //     <SearchBar placeholder="검색어를 입력해주세요" />
    //   </div>
    //   <div className={styles.container__buttonBox}>
    //     <Button variant={"outline"} className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500" onClick={onCreate}>
    //       Add New Page
    //     </Button>
    //   </div>
    //   <div className={styles.container__todos}>
    //     <span className={styles.container__todos__label}>Your To Do</span>
    //     {/* Is Supabase todos : 데어터가 있을때 */}
    //     <div className={styles.container__todos__list}>
    //       {todos &&
    //         todos.map((item: any) => {
    //           return (
    //             <div key={item.id} className="flex item-center py-2 bg-{#f5f5f4} round-sm cursor-pointer">
    //               <Dot className="mr-1 text-green-400"></Dot>
    //               <span className="text-sm">{item.title === "" ? "제목없음" : item.title}</span>
    //             </div>
    //           );
    //         })}
    //     </div>
    //   </div>
    // </div>

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
