"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { nanoid } from "nanoid";
import { supabase } from "@/utils/supabase";

import styles from "./page.module.scss";
import Image from "next/image";
// import Image from "./../assets/images/round-button.svg";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";

import LabelCalendar from "@/components/common/calendar/LabelCalendar";
import BasicBoard from "@/components/common/board/BasicBoard";

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

// 샘플 BoardContent 데이터
// const boards: BoardContent[] = [
//   { boardId: 1, isCompleted: false, title: "Board 1", startDate: new Date(), endDate: new Date(), content: "Description 1" },
//   { boardId: 2, isCompleted: false, title: "Board 2", startDate: new Date(), endDate: new Date(), content: "Description 2" },
// ];

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [boards, setBoards] = useState<Todo>(); // TODO 전체 boards 데이터 Todo | (() => Todo)
  const [startDate, setStartDate] = useState<string | Date | undefined>(new Date());
  const [endDate, setEndtDate] = useState<string | Date | undefined>(new Date());

  // 보더 컨텐츠 값을 받아서 supabase에 저장 insertRowData(newContents);
  const insertRowData = async (contents: BoardContent[]) => {
    console.log("insertRowData");

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

    // if (boards?.contents) {
    //   // supabase 데이터베이스 연동
    //   const { data, error, status } = await supabase
    //     .from("todos")
    //     .update({
    //       // 컨텐츠 수정
    //       contents: contents, // contents: BoardContent[]  보드컨텐츠 배열
    //     })
    //     .eq("id", pathname.split("/")[2])
    //     .select();

    //   if (error) {
    //     console.log(error);
    //     toast({
    //       title: "에러가 발생했습니다.",
    //       description: "콘솔 창에 출력된 에러를 확인하세요",
    //     });
    //   }

    //   // update 완료하면 status코드 204
    //   if (status === 204) {
    //     console.log("status 204", status);
    //     toast({
    //       title: "추가완료",
    //       description: "새로운 TO DO Board가 추가 되었습니아 ",
    //     });
    //     getData();
    //   }

    //   if (status === 200) {
    //     console.log("status 200", status);
    //     toast({
    //       title: "추가완료",
    //       description: "새로운 TO DO Board가 추가 되었습니아 ",
    //     });
    //     getData();
    //   }
    // } else {
    //   // supabase 데이터베이스 연동
    //   const { data, error, status } = await supabase
    //     .from("todos")
    //     .insert({
    //       // 컨텐츠 수정
    //       contents: contents, // contents: BoardContent[]  보드컨텐츠 배열
    //     })
    //     .eq("id", pathname.split("/")[2])
    //     .select();

    //   if (error) {
    //     console.log(error);
    //     toast({
    //       title: "에러가 발생했습니다.",
    //       description: "콘솔 창에 출력된 에러를 확인하세요",
    //     });
    //   }

    //   if (status === 201) {
    //     console.log("status 201", status);
    //     toast({
    //       title: "생성 완료",
    //       description: "새로운 TO DO Board가 생성 되었습니아 ",
    //     });
    //     getData();
    //   }
    // }
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
        }
      });
    }

    if (error) {
      console.log(error);
    }
  };

  const onSave = () => {};

  // 화면이 마운트 됐을떄
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.container}>
      <div className="absolute top-6 left-7 flex items-center gap-2">
        <Button variant={"outline"} size={"icon"} onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
        <Button variant={"outline"} onClick={onSave}>
          저장
        </Button>
      </div>
      <header className={styles.container__header}>
        <div className={styles.container__header__content}>
          <input type="text" placeholder="Enter Title Here" className={styles.input} />
          <div className={styles.progressBar}>
            <span className={styles.progressBar__status}>0/10 completed</span>
            {/* 프로그래스바 ui */}
            <Progress value={33} className="w-[30%]" indicatorColor="bg-green-500" />
          </div>
          <div className={styles.calendarBox}>
            <div className={styles.calendarBox__calendar}>
              <LabelCalendar label="From" />
              <LabelCalendar label="To" />
            </div>
            <Button variant="outline" className="w-[15%] bg-orange-400 text-white border-orange-500 hover:bg-orange-400 hover:text-white" onClick={createBoard}>
              Add New Board
            </Button>
          </div>
        </div>
      </header>
      <main className={styles.container__body}>
        {/* // 'BoardContent[]' 형식은 'ReactNode' 형식에 할당할 수 없습니다 */}
        {boards?.contents.length === 0 ? ( // 보드 배열 데이터가 없으면
          <div className="flex items-center justify-center w-full h-full">
            <div className={styles.container__body__infoBox}>
              <span className={styles.title}>There is no board yet.</span>
              <span className={styles.subtitle}>Click the button and start flashing!</span>
              <Button className={styles.button} onClick={createBoard}>
                <Image src="/assets/images/round-button.svg" alt="flash" width={74} height={74} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start w-full h-full gap-4 overflow-y-scroll">
            {boards?.contents.map((board: BoardContent) => {
              return <BasicBoard key={board.boardId} data={board} handleBoards={setBoards} />;
            })}
          </div>
        )}
      </main>
    </div>
  );
}
