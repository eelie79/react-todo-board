"use client";

import { supabase } from "@/utils/supabase/client";
import { taskAtom } from "@/store/atoms";
import { useAtom } from "jotai";
import { toast } from "@/hooks/use-toast";
import { useGetTaskById } from "@/hooks/apis";
import { Task, Board } from "@/types";

// contents[] 배열 데이터 안에 있는 "id"값을 찾아서 삭제한 다음에 다시 업데이트
function useDeleteBoard(taskId: number, boardId: string) {
  const [task] = useAtom(taskAtom);
  const { getTaskById } = useGetTaskById(taskId);

  const deleteBoard = async () => {
    try {
      const { status, error } = await supabase
        .from("todos")
        .update({
          //   contents: [],
          contents: task?.contents.filter((board: Board) => board.id !== boardId),
        })
        .eq("id", taskId);

      // 수정이나 삭제가 완료가 되면 status 코드가 204
      if (status === 204) {
        toast({
          title: "선택한 TODO-BOARD 가 삭제 되었습니다.",
          description: "새로운 할일이 생기면 TODO-BOARD를 생성해주세요!",
        });
        /** TASK를 갱신 */
        getTaskById();
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
      console.error(error);
      toast({
        variant: "destructive",
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
      });
    }
  };

  return deleteBoard;
}

export { useDeleteBoard };
