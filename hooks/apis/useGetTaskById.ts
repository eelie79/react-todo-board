"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { taskAtom } from "@/store/atoms";
import { supabase } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";

// task ID에 해당하는 데이터만 조회
function useGetTaskById(taskId: number) {
  const [task, setTask] = useAtom(taskAtom); // 단일 데이터 조회

  const getTaskById = async () => {
    try {
      // .eq("id", taskId); ID가 동일한 데이터만 data에 반환
      const { data, status, error } = await supabase.from("todos").select("*").eq("id", taskId);

      if (data && status === 200) setTask(data[0]); // 조회 status 200 배열 데이터중 첫번째 1개만 task에 담기

      if (error) {
        toast({
          variant: "destructive",
          title: "에러가 발생했습니다.",
          description: `Supabase 오류: ${error.message || "알 수 없는 오류"}`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
      });
    }
  };

  // taskId가 있고 아이디가 바뀔때 마다
  useEffect(() => {
    if (taskId) getTaskById();
  }, [taskId]);

  return { task, getTaskById };
}

export { useGetTaskById };
