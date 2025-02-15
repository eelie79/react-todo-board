"use client";

import { toast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { useAtom } from "jotai";
import { tasksAtom } from "@/store/atoms";

function useSearch() {
  //   const { tasks, setTasks } = useAtom(tasksAtom);
  const [tasks, setTasks] = useAtom(tasksAtom);
  // '[Task[], SetAtom<[SetStateAction<Task[]>], void>]' 형식에 'setTasks' 속성이 없습니다.

  const search = async (searchTerm: string) => {
    try {
      const { data, status, error } = await supabase.from("todos").select("*").ilike("title", `%${searchTerm}%`);
      // 타이틀 컬럼에에 %템플릿문자열%에 한글자라도 포함이 되었는지?
      if (data && status === 200) {
        // 조회가 되면
        setTasks(data); // jotai에 tasksAtom 상태를 업데이트
      }
      if (error) {
        toast({
          variant: "destructive",
          title: "에러가 발생했습니다.",
          description: `Supabase 오류: ${error.message} || 알 수 없는오류`,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다. 다시 시도해 주세요!",
      });
    }
  };
  return { search };
}

export { useSearch };
