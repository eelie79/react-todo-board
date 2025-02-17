"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { useAtomValue } from "jotai";
import { taskAtom } from "@/store/atoms";

import { toast } from "@/hooks/use-toast";

import { Task, Board } from "@/types";
import { Button, Checkbox, Card, LabelDatePicker, Separator } from "@/components/ui";
import { ChevronDown, ChevronUp, Ghost } from "lucide-react";
import { MarkdownDialog } from "@/components/common";
import { useGetTasks, useCreateBoard, useDeleteBoard, useGetTaskById } from "@/hooks/apis";

import MDEditor from "@uiw/react-md-editor";

interface Props {
  board: Board;
  // handleBoards: (data: Task) => void;
}

// board.isCompleted / board.title / board.startDate 데이터 연결
export function BoardCard({ board }: Props) {
  const { id } = useParams();
  const { tasks, getTasks } = useGetTasks();

  // TASK의 개별 TODO-BOARD 삭제(TODO-BOARD - todo 카드 1건 삭제)
  const handleDeleteBoard = useDeleteBoard(Number(id), board.id);
  const updateBoards = useCreateBoard();

  const task = useAtomValue(taskAtom); // 조회용 단일 데이터 호출
  const { getTaskById } = useGetTaskById(Number(id)); // 특정 id 단일 TASK 데이터 조회

  const [isCompleted, setIsCompleted] = useState<boolean>(board.isCompleted ? board.isCompleted : false);
  const [title, setTitle] = useState<string>(board.title ? board.title : "");
  const [startDate, setStartDate] = useState<Date | undefined>(board.startDate ? new Date(board.startDate) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(board.endDate ? new Date(board.endDate) : undefined);
  // const [content] = useState<string>(board.content ? board.content : "");
  const [isShowContent, setIsShowContent] = useState<boolean>(false);
  const [test, setTest] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // board 내용이 바뀌면 initState 호출출
  // useEffect(() => {
  //   initState(); // Dialog가 true 열릴때만 상태 초기화화
  // }, [task]); // isDialogOpen이 변경 될떼만 실행

  // board 내용이 바뀌면 initState 호출출
  // useEffect(() => {
  //   if (isDialogOpen) {
  //     setIsDialogOpen(false); // 창닫기
  //     initState(); // Dialog가 true 열릴때만 상태 초기화화
  //   }
  // }, [isDialogOpen]); // isDialogOpen이 변경 될떼만 실행

  // 다이얼로그 닫힐때 초기화
  const initState = () => {
    setIsCompleted(board.isCompleted || false);
    setTitle(board.title || "");
    setStartDate(board.startDate ? new Date(board.startDate) : undefined);
    setEndDate(board.endDate ? new Date(board.endDate) : undefined);
  };

  const handleSaveBoard = async (boardId: string) => {
    // if (!board.title) {
    //   // 올바르게 todos 테이블에 ROW 데이터 한 줄이 올바르게 생성이 되면 실행
    //   toast({
    //     variant: "destructive",
    //     title: "TODO-BOARD를 저장 할 수 없습니다.",
    //     description: "TODO-BOARD를 저장하기전 제목을 먼저 등록해주세요",
    //   });
    //   return;
    // }
    if (!title || !startDate || !endDate) {
      // 올바르게 todos 테이블에 ROW 데이터 한 줄이 올바르게 생성이 되면 실행
      toast({
        title: "TODO-BOARD를 저장 할 수 없습니다.",
        description: "TODO-BOARD를 저장하기전 제목을 먼저 등록해주세요",
      });
      return;
    }

    // 해당 보드에 대한 데이터만 수정
    try {
      const newBoards = task?.contents.map((board: Board) => {
        if (board.id === boardId) {
          console.log(title, startDate, endDate);
          // return { ...board, title, startDate, endDate }; // 변경된 값만 변경
          return { ...board, isCompleted, title, startDate, endDate }; // 변경된 값만 변경
        }
        return board;
      });
      await updateBoards(Number(id), "contents", newBoards);
      // initState(); // 초기값 세팅
      getTaskById();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다. 다시 시도해 주세요!",
      });
      throw error;
    }
  };

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

  return (
    <Card className="w-full flex flex-col items-center p-5">
      {/* 게시물 카드 제목 영역 */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="w-full flex items-center justify-start gap-2">
          {/* <Checkbox className="h-5 w-5" checked={board.isCompleted} /> */}
          {/* <input type="text" placeholder="등록된 제목이 없습니다" value={board.title} className="w-full text-xl outline-none bg-transparent" disabled={true} /> */}
          <Checkbox
            className="h-5 w-5"
            // checked={isCompleted}
            checked={board.isCompleted ? board.isCompleted : isCompleted}
            onCheckedChange={(checked) => {
              if (typeof checked === "boolean") {
                setIsCompleted(checked);
              }
            }}
          />
          <input
            type="text"
            placeholder="등록된 제목이 없습니다."
            // value={board.title ? board.title : title}
            value={title}
            className="w-full text-xl outline-none bg-transparent"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          {/* 조회용 인풋 */}
        </div>
        {/* <Button variant={"ghost"} size={"icon"} onClick={() => setIsShowContent(true)}> */}
        <Button variant={"ghost"} size={"icon"} onClick={() => setIsShowContent(!isShowContent)}>
          {isShowContent ? <ChevronUp className="text-[#6d6d6d]" /> : <ChevronDown className="text-[#6d6d6d]" />}
        </Button>
      </div>
      {/* 캘린더 및 버튼 박스 영역 */}
      <div className="w-full flex items-center justify-between">
        {/* 캘린더 박스 */}
        <div className="flex items-center gap-5">
          {/* <LabelDatePicker label={"From"} value={board.startDate} readonly={true} />
          <LabelDatePicker label={"To"} value={board.endDate} readonly={true} /> */}
          {/* <LabelDatePicker label={"From"} value={board.startDate} onChange={setStartDate} />
          <LabelDatePicker label={"To"} value={board.endDate} onChange={setEndDate} /> */}
          {/* <LabelDatePicker label={"From"} readonly={true} value={board.startDate} />
          <LabelDatePicker label={"To"} readonly={true} value={board.endDate} /> */}
          <LabelDatePicker label={"From"} value={startDate} onChange={setStartDate} />
          <LabelDatePicker label={"To"} value={endDate} onChange={setEndDate} />
        </div>
        {/* 버튼 박스  */}
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} className="font-normal text-[#6d6d6d]" onClick={() => handleSaveBoard(board.id)}>
            Save
          </Button>
          <Button variant={"ghost"} className="font-normal text-rose-600 hover:text-rose-600 hover:bg-rose-50" onClick={handleDeleteBoard}>
            Delete
          </Button>
        </div>
      </div>

      {/* <MDEditor height={320 + "px"} value={board.content ? board.content : ""} /> */}
      {isShowContent && <MDEditor height={320 + "px"} value={board.content ? board.content : "**Hello, World!!**"} style={{ width: 100 + "%", marginTop: 16 + "px" }} />}

      <Separator className="my-3" />

      {/* Add Contents 컴포넌트 */}
      {/* 이 컴포넌트에서 Add Contents 버튼을 클릭하면 게시글 작성 모달이 표시된다 */}
      {/* <MarkdownDialog data={data} updateBoards={getData} /> */}
      <MarkdownDialog board={board}>
        <Button variant={"ghost"} className="font-normal text-[#6d6d6d]">
          {board.title ? "Update Contents" : "Add Contents"}
        </Button>
      </MarkdownDialog>
    </Card>
  );
}
