"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { taskAtom } from "@/store/atoms";

import MDEditor from "@uiw/react-md-editor";
import { useCreateBoard, useGetTaskById } from "@/hooks/apis";
import { useToast } from "@/hooks/use-toast";

import { Button, Checkbox, Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger, DialogClose, DialogDescription, LabelDatePicker, Separator } from "@/components/ui";

import { Task, Board } from "@/types";

interface Props {
  children: React.ReactNode;
  // data: Board;
  board: Board;
  // updateBoards: () => void;
  open: boolean;
}

export function MarkdownDialog({ board, children, open }: Props) {
  const { toast } = useToast();
  const { id } = useParams();
  // const createBoard = useCreateBoard(); // page.tsx에서는 createBoard
  const updateBoards = useCreateBoard();

  const task = useAtomValue(taskAtom); // 조회용 단일 데이터 호출
  const { getTaskById } = useGetTaskById(Number(id));

  /* 해당 컴포넌트에서 사용되는 상태 값 */
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [content, setContent] = useState<string | undefined | "">("**Hello, World!!**");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  /* 상태값 초기화 & board 데이터 있으면 board 데이터 연결 */
  const initState = () => {
    setIsCompleted(board.isCompleted || false);
    setTitle(board.title || "");
    setStartDate(board.startDate ? new Date(board.startDate) : undefined);
    setEndDate(board.endDate ? new Date(board.endDate) : undefined);
    setContent(board.content || "**Hello, World!!**");
  };

  // board 내용이 바뀌면 initState 호출출
  useEffect(() => {
    if (isDialogOpen) {
      initState(); // Dialog가 true 열릴때만 상태 초기화화
    }
    // initState();
  }, [isDialogOpen]); // isDialogOpen이 변경 될떼만 실행

  // 다이얼로그 닫힐때 초기화
  const handleCloseDialog = () => {
    setIsDialogOpen(false); // 창닫기
    initState(); // 창닫으면 입력값 초기화
  };

  // supabase 저장 -> onSubmit 등록버튼 클릭 호출시 board ID값 전달 - contents[] 중 특정 보드한개 등록
  const handleSubmit = async (boardId: string) => {
    // boardId -> nanoid 함수 string
    console.log("onSubmit 함수 호출");
    // !title || !startDate || !endDate || !content
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "기입되지 않은 데이터(값)가 있습니다.",
        description: "제목, 콘텐츠 값은 필수 값입니다!, 모두 작성해 주세요",
      });
      return;
    }
    // 해당 Board에 대한 데이터만 수정
    try {
      /* contents 배열에서 선택한 board를 찾고, 수정된 값으로 업데이트 / task는 null일수 있음 */
      const newBoards = task?.contents.map((board: Board) => {
        if (board.id === boardId) {
          // 클릭했을때 넘겨주는 id 하고 같으면
          console.log(startDate, endDate);
          return { ...board, isCompleted, title, startDate, endDate, content }; // 변경된 값만 변경
        }
        return board;
      });
      await updateBoards(Number(id), "contents", newBoards); // contents 뉴데이터로 치환 -> 데이터 업데이트 훅
      handleCloseDialog(); // 초기값 세팅
      getTaskById(); //화면 ui가 갱신되지 않아서 저장되는 순간 화면에 데이터 갱신
    } catch (error) {
      /* 네트워크 오류나 애기치 않은 에러를 잡기 위해 catch 구문 사용 */
      toast({
        variant: "destructive",
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다. 다시 시도해 주세요!",
      });
      throw error;
    }
  };

  return (
    // Dialog 컴포넌트 안에 LabelDatePicker 를 사용할때는 modal={false}속성이 들어가야함
    // modal={false}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={false}>
      {/* {board.title ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">Add Contents</span>
        </DialogTrigger>
      )} */}
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col">
          <DialogTitle>
            <div className="flex items-center justify-start gap-2">
              <Checkbox
                className="w-5 min-w-5 h-5"
                checked={isCompleted}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean") {
                    setIsCompleted(checked);
                  }
                }}
              />
              <input
                type="text"
                placeholder="게시물의 제목을 입력해 주세요"
                value={title}
                className="w-full text-xl outline-none bg-transparent"
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
            </div>
          </DialogTitle>
          <DialogDescription>마크다운 에디터를 사용하여 TODO-BOARD를 예쁘게 꾸며보세요.</DialogDescription>
        </DialogHeader>

        {/* 캘린더 박스 */}
        <div className="flex items-center gap-5">
          {/* <LabelDatePicker label={"From"} value={startDate} readonly={true} /> /
          <LabelDatePicker label={"To"} value={endDate} readonly={true} /> */}
          <LabelDatePicker label="From" value={startDate} onChange={setStartDate} />
          <LabelDatePicker label="To" value={endDate} onChange={setEndDate} />
        </div>

        <Separator />

        {/* 마크다운 에디터 UI영역 */}
        {/* <MDEditor height={100 + "%"} value={data.content ? data.content : content} onChange={setContent} /> */}
        {/* <MDEditor height={320 + "px"} onChange={setContent} value={content} /> */}
        <MDEditor height={320 + "px"} value={content} onChange={setContent} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} onClick={handleCloseDialog}>
              취소
            </Button>
          </DialogClose>
          <Button type="submit" variant={"ghost"} className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white" onClick={() => handleSubmit(board.id)}>
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
