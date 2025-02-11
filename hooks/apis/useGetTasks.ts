"use Client";

import { useAtom } from "jotai"; // 상태관리 라이브러리
import { tasksAtom } from "@/store/atoms";
import { supabase } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";

// task 전부다 조회
function useGetTasks() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const getTasks = async () => {
    try {
      const { data, status, error } = await supabase.from("todos").select("*");

      /* 성공적으로 데이터가 반환될 경우 */
      if (data && status === 200) setTasks(data);
      if (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "에러가 발생했습니다.",
          description: `Supabase 오류: ${error.message} || "알 수 없는 오류"`,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
      });
    }
  };
  return { getTasks, tasks };
}

export { useGetTasks };
