"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { useAtomValue } from "jotai";
import { taskAtom } from "@/store/atoms";

import MDEditor from "@uiw/react-md-editor";
import { useCreateBoard } from "@/hooks/apis";
import { useToast } from "@/hooks/use-toast";

import { Button, Checkbox, Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger, DialogClose, DialogDescription, LabelDatePicker, Separator } from "@/components/ui";

import { Task, Board } from "@/types";

interface Props {
  children: React.ReactNode;
  // data: Board;
  board: Board;
  // updateBoards: () => void;
}

export function MarkdownDialog({ board, children }: Props) {
  const { id } = useParams();
  const updateBoards = useCreateBoard();
  const task = useAtomValue(taskAtom); // 조회용

  const { toast } = useToast();

  /* 해당 컴포넌트에서 사용되는 상태 값 */
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [content, setContent] = useState<string>("**Hello, World!!**");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    initState();
  }, [board]);

  /* 상태값 초기화 */
  const initState = () => {
    setIsCompleted(board.isCompleted || false);
    setTitle(board.title || "");
    setStartDate(board.startDate ? new Date(board.startDate) : undefined);
    setEndDate(board.endDate ? new Date(board.endDate) : undefined);
    setContent(board.content || "**Hello, World!!**");
  };

  // 다이얼로그 닫힐때 초기화
  const handleCloseDialog = () => {
    setIsDialogOpen(false); // 창닫기
    initState();
  };

  // supabase 저장 -> onSubmit 호출시 board ID값 전달 - contents[] 중 특정 보드한개 등록
  const handleSubmit = async (boardId: string) => {
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
      /* contents 배열에서 선택한 board를 찾고, 수정된 값으로 업데이트 */
      const newBoards = task?.contents.map((board: Board) => {
        if (board.id === boardId) {
          return { ...board, isCompleted, title, startDate, endDate, content };
        }
        return board;
      });
      await updateBoards(Number(id), "contents", newBoards); // 뉴데이터로 치환
      handleCloseDialog();
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
    //  modal={false}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
          <LabelDatePicker label="From" value={startDate} onChange={setStartDate} />
          <LabelDatePicker label="To" value={endDate} onChange={setEndDate} />
        </div>

        <Separator />

        {/* 마크다운 에디터 UI영역 */}
        {/* <MDEditor height={100 + "%"} value={data.content ? data.content : content} onChange={setContent} /> */}
        {/* <MDEditor height={320 + "px"} onChange={setContent} value={content} /> */}
        <MDEditor height={320 + "px"} value={content} onChange={setContent} />
        {/* onChange?: (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, state?: ContextStore) => void; */}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} onClick={handleCloseDialog}>
              취소
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant={"ghost"}
            className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
            // onClick={onSubmit}  => onSubmit(data.boardId) 클릭이벤트 데이터 가져와서 ID전달
            // onClick={() => onSubmit(data.boardId)}
            onClick={() => handleSubmit(board.id)}>
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
