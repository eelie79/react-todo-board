"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";

function useCreateTask() {
  const router = useRouter();
  const { toast } = useToast();

  const createTask = async () => {
    try {
      const { data, status, error } = await supabase
        .from("todos")
        .insert([
          {
            title: null,
            start_date: null,
            end_date: null,
            contents: [],
          },
        ])
        .select();

      console.log(data);

      if (data && status === 201) {
        /* tasks 테이블에 ROW 데이터 한 줄이 올바르게 생성되면 tasksAtom에 할당한다. */
        // setTasks((prevTasks) => [...prevTasks, data[0]]); // Jotai의 tasksAtom 상태 업데이트
        toast({
          title: "새로운 TASK가 생성되었습니다.",
          description: "나만의 TODO-BOARD를 생성해보세요!",
        });
        router.push(`/task/${data[0].id}`);
      }

      if (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "에러가 발생했습니다.",
          description: `Supabase 오류: ${error.message} || "알 수 없는 오류"`,
        });
      }
    } catch (error) {
      /** 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용 */
      console.error(error);
      toast({
        variant: "destructive",
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
      });
    }
  };

  return createTask;
}

export { useCreateTask };
