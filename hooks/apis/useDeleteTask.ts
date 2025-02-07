"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";

function useDeleteTask() {
  const router = useRouter();

  const deleteTask = async (taskId: number) => {
    try {
      const { status, error } = await supabase.from("todos").delete().eq("id", taskId);

      if (status === 201) {
        toast({
          title: "선택한 TASK 가 삭제 되었습니다.",
          description: "TASK가가 TODO-BOARD에서 삭제 되었습니다!",
        });
        router.push("/"); // 초기 페이지로 이동
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

  return deleteTask;
}

export { useDeleteTask };

// 기존 소스
// const pathname = usePathname();
// const { toast } = useToast();

// const handleDelete = async (id: string | number) => {
//   console.log("handleDelete 출력 확인");

//   // 해당 Board ID에 대한 데이터만 수정 혹은 삭제
//   let { data: todos } = await supabase.from("todos").select("*"); // 모든 데이터 호출

//   if (todos !== null) {
//     todos.forEach(async (item: Task) => {
//       if (item.id === Number(pathname.split("/")[2])) {
//         console.log(item);

//         let newContents = item.contents.filter((element: Board) => {
//           return element.id !== id; // 아이디가 일치 하지 않으면 선택하지 않음음
//         });

//         // Supabase에 다시 저장
//         const { data, error, status } = await supabase
//           .from("todos")
//           .update({
//             contents: newContents,
//           })
//           .eq("id", pathname.split("/")[2]); // 아이디와 == pathname 같으면 contents 업데이트

//         if (error) {
//           console.log(error);
//           toast({
//             title: "에러가 발생했습니다.",
//             description: "콘솔 창에 출력된 에러를 확인하세요",
//           });
//         }

//         if (status === 204) {
//           console.log("status 204", status);
//           toast({
//             title: "삭제가 완료되었습니다다",
//             description: "Supabase에서 삭제 되었습니다",
//           });
//           getData();
//         }
//       } else {
//         return;
//       }
//     });
//   }
// };

// // Supabase에 기존에 생성된 보드가 있는지 없는지 확인 -> 데이터 갱신
// const getData = async () => {
//   let { data: todos, error } = await supabase.from("todos").select("*"); // 전체 데이터 다 가져오기

//   if (error) {
//     toast({
//       title: "데이터 로드 실패패.",
//       description: "데이터르르 불러오는 중 실패했습니다",
//     });
//     return;
//   }

//   if (todos === null || todos.length === 0) {
//     toast({
//       title: "조회가능한 데이터가 없습니다.",
//       description: "조회가능한 데이터가 없습니다.",
//     });
//     return;
//   }

//   todos.forEach((item: Task) => {
//     if (item.id === Number(pathname.split("/")[2])) {
//       handleBoards(item);
//     }
//   });
// };
