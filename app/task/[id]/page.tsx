"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { nanoid } from "nanoid";
import { supabase } from "@/utils/supabase";
import { useAtom } from "jotai";
import { sidebarStateAtom } from "@/store";

import styles from "./page.module.scss";
import Image from "next/image";
// import Image from "./../assets/images/round-button.svg";

import { Button, Progress, LabelDatePicker } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";

import BasicBoard from "@/components/common/board/BasicBoard";
import { Input } from "postcss";

interface Todo {
  id: number;
  title: string;
  start_date: string | Date;
  end_date: string | Date;
  contents: BoardContent[]; // {boards.contents} // 'BoardContent[]' 형식은 'ReactNode' 형식에 할당할 수 없습니다
}

interface BoardContent {
  boardId: string | number;
  isCompleted: boolean; // checkBox
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  content: string; // 에디터 안의 입력 텍스트 데이터 컨텐츠
}

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom);
  const [title, setTitle] = useState<string>("");
  const [boards, setBoards] = useState<Todo>(); // TODO 전체 boards 데이터 Todo | (() => Todo)
  const [startDate, setStartDate] = useState<string | Date | undefined>(new Date());
  const [endDate, setEndtDate] = useState<string | Date | undefined>(new Date());

  // 보더 컨텐츠 값을 받아서 supabase에 저장 insertRowData(newContents);
  const insertRowData = async (contents: BoardContent[]) => {
    console.log("insertRowData");

    //id 값이 pathname 인 레코드를 찾아 contents 컬럼을 업데이트합니다.
    const { data, error, status } = await supabase
      .from("todos")
      .update({
        // 컨텐츠 수정
        contents: contents, // contents: BoardContent[]  보드컨텐츠 배열
      })
      .eq("id", pathname.split("/")[2]);

    if (error) {
      console.log(error);
      toast({
        title: "에러가 발생했습니다.",
        description: "콘솔 창에 출력된 에러를 확인하세요",
      });
    }

    // update 완료하면 status코드 204
    if (status === 204) {
      console.log("status 204", status);
      toast({
        title: "추가완료",
        description: "새로운 TO DO Board가 추가 되었습니아 ",
      });
      getData();
    }
  };

  // ADD NEW BOARD 버튼을 클릭하였을떄
  const createBoard = () => {
    let newContents: BoardContent[] = []; // 보드컨텐츠 만 담기는 배열

    // 보드 컨텐츠 입력 객체 리터럴 초기값
    const BoardContent = {
      boardId: nanoid(),
      isCompleted: false,
      title: "",
      startDate: "",
      endDate: "",
      content: "",
    };

    console.log("BoardContent: ", BoardContent);

    if (boards && boards.contents.length > 0) {
      newContents = [...boards.contents]; // [] board list
      newContents.push(BoardContent); // 보드 컨텐츠 1증가
      insertRowData(newContents);
      console.log("등록된 보드 컨텐츠 있음 화면출력: ", BoardContent);
    } else if (boards && boards.contents.length === 0) {
      newContents.push(BoardContent);
      insertRowData(newContents);
      console.log("등록된 보드 없음 화면에 추가버튼 출력: ", BoardContent);
    }
    console.log("ADD NEW BOARD Clicked!", newContents);
  };

  // Supabase에 기존에 생성된 보드가 있는지 없는지 확인 -> 데이터 갱신
  const getData = async () => {
    let { data: todos, error, status } = await supabase.from("todos").select("*"); // 전체 데이터 다 가져오기

    if (todos !== null) {
      console.log("todo ", todos);
      todos.forEach((item: Todo) => {
        if (item.id === Number(pathname.split("/")[2])) {
          setBoards(item);
          console.log("item: ", item);

          setTitle(item.title); // boards를 가져온 후 title 값을 새로 갱신
        }
      });
    }
  };

  const handleSave = async () => {
    console.log("onSave");

    // 1. Enter Title Here 입력 제목 저장 const {} = await supabase.from().update().eq();
    const { data, error, status } = await supabase.from("todos").update({ title: title }).eq("id", pathname.split("/")[2]);

    if (error) {
      console.log(error);
      toast({
        title: "에러가 발생했습니다.",
        description: "콘설창에 출력된 에러를 확인하세요!",
      });
    }

    if (status === 204) {
      toast({
        title: "수정 완료!",
        description: "작성한 게시물이 Supabase에 올바르게 저장 되었습니다.",
      });

      // 등록 후 재렌더링
      getData();

      /* 상태변경 함수 (예시: onSave 함수호출될때 상태값 변경)  */
      setSidebarState("updated");
    }
  };

  const handleDelete = () => {};

  // 화면이 마운트 됐을떄
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles[`header__btn-box`]}>
        <Button variant={"outline"} size={"icon"} onClick={() => router.push("/")}>
          <ChevronLeft />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant={"secondary"} onClick={handleSave}>
            저장
          </Button>
          <Button className="text-rose-600 bg-red-50 hover:bg-rose-50" onClick={handleDelete}>
            삭제
          </Button>
        </div>
      </div>
      <div className={styles.header__top}>
        {/* 제목 입력 Input 섹션 */}
        <input
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          placeholder="Enter Title Here"
          className="styles.header__top__input"
        />
        {/* 진행상황 척도 그래프 섹션 */}
        <div className="flex items-center justify-start gap-4">
          <small className="text-sm font-medium leading-none text-[#6d6d6d]">1/10 Completed!</small>
          <Progress className="w-60 h-[10px]" value={33} indicatorColor={"bg-[#006dea]"} />
        </div>
      </div>
      {/* 캘린더 + ADD New Board 버튼 섹션션 */}
      <div className={styles.header__bottom}>
        <div className="flex items-center gap-5">
          <LabelDatePicker label={"From"} />
          <LabelDatePicker label={"To"} />
        </div>
        <Button
          className="text-white bg-[#E79057] hover:bg-[#E79057] hover:ring-1 hover:ring-[#E79057] 
        hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg"
          onClick={createBoard}>
          ADD NEW BOARD
        </Button>
      </div>
    </div>
  );
}
