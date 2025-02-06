"use client";

import { supabase } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Board } from "@/types";

function useCreateBoard() {
  const createBoard = async (taskId: number, column: string, newValue: Board[] | undefined) => {
    try {
      const { data, status, error } = await supabase
        .from("todos")
        .update({
          [column]: newValue, // 이미 있는 보드 데이터에 컨텐츠 데이터만 업데이트 {contents: contents}
        })
        .eq("id", taskId)
        .select(); // 업데이트가 되었을때 task 조회

      if (data && status === 200) {
        // 올바르게 todos 테이블에 ROW 데이터 한 줄이 올바르게 생성이 되면 실행
        toast({
          title: "새로운 TODO-BOARD를 생성하였습니다.",
          description: "생성한 TODO-BOARD를 알차게 채워보세요!",
        });
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
      console.log(error);
      toast({
        variant: "destructive",
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
      });
    }
  };
  return createBoard;
}

export { useCreateBoard };
