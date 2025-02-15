"use client";

import { supabase } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Board } from "@/types";

function useCreateContent() {
  const createContent = async (boardId: number, newValue: Board[] | undefined) => {
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
  return createContent;
}

export { useCreateContent };

// 기존 코드
// 보더 컨텐츠 값을 받아서 supabase에 저장 insertRowData(newContents);
// const insertRowData = async (contents: Board[]) => {
//   // Supabase 데이터베이스에 연동
//   const { data, error, status } = await supabase
//   .from("todos")
//   .update({contents: contents})
//   .eq("id", pathname.split("/")[2]);

//   if (status === 204) {
//     // 올바르게 todos 테이블에 ROW 데이터 한 줄이 올바르게 생성이 되면 실행
//     toast({
//       title: "추가 완료!",
//       description: "새로운운 TODO-BOARD가 추가 되었습니다다",
//     });
//     router.push(`/task/${data[0].id}`);
//   }

//   if (error) {
//     console.log(error);
//     toast({
//       title: "에러가 발생했습니다.",
//       description: "콘솔창에 출력된 에러를 확인하세요",
//     });
//   }
// };

// const handleSave = async () => {
// console.log("onSave");
// // 1. Enter Title Here 입력 제목 저장 const {} = await supabase.from().update().eq();
// const { data, error, status } = await supabase.from("todos").update({ title: title }).eq("id", pathname.split("/")[2]);
// if (error) {
//   console.log(error);
//   toast({
//     title: "에러가 발생했습니다.",
//     description: "콘설창에 출력된 에러를 확인하세요!",
//   });
// }
// if (status === 204) {
//   toast({
//     title: "수정 완료!",
//     description: "작성한 게시물이 Supabase에 올바르게 저장 되었습니다.",
//   });
//   // 등록 후 재렌더링
//   getData();
//   /* 상태변경 함수 (예시: onSave 함수호출될때 상태값 변경)  */
//   setSidebarState("updated");
// }
// };
