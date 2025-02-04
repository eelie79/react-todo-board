"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { nanoid } from "nanoid";

import styles from "./page.module.scss";
import Image from "next/image";
// import Image from "./../assets/images/round-button.svg";
// import Image from "next/image";/

import LabelCalendar from "@/components/common/calendar/LabelCalendar";
import BasicBoard from "@/components/common/board/BasicBoard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase";

interface Todo {
  id: number;
  title: string;
  start_date: string | Date;
  end_date: string | Date;
  contents: BoardContent[];
}

interface BoardContent {
  boardId: string | number;
  isCompleted: boolean;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  content: string;
}

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  const [boards, setBoards] = useState<Todo>();
  const [startDate, setStartDate] = useState<string | Date | undefined>(new Date());
  const [endDate, setEndtDate] = useState<string | Date | undefined>(new Date());
  const { toast } = useToast();

  const insertRowData = async (contents: BoardContent[]) => {
    // Supabase 데이터 베이스 연동
    if (boards?.contents) {
      const { data, error, status } = await supabase
        .from("todos")
        .update({
          contents: contents,
        })
        .eq("id", pathname.split("/")[2]) // 수정해야함
        .select();

      if (error) {
        console.log(error);
        toast({
          title: "에러가 발생했습니다.",
          description: "콘솔 창에 출력된 에러를 확인하세요",
        });
      }

      if (status === 200) {
        toast({
          title: "추가 완료!",
          description: "새로운 TO DO BOARD가 추가 되었습니다다",
        });
        getData();
      }
    } else {
      // 만약에 값이 없으면 생성
      const { data, error, status } = await supabase
        .from("todos")
        .insert({
          // 값 생성
          contents: contents,
        })
        .eq("id", pathname.split("/")[2])
        .select();

      if (error) {
        console.log(error);
        toast({
          title: "에러가 발생했습니다.",
          description: "콘솔 창에 출력된 에러를 확인하세요",
        });
      }

      if (status === 201) {
        toast({
          title: "생성 완료!",
          description: "새로운 TO DO BOARD가 생성 되었습니다다",
        });
        getData();
      }
    }
  };

  // ADD NEW BOARD 버튼을 클릭하였을떄
  const createBoard = () => {
    console.log("BoardContent");
    let newContents: BoardContent[] = [];
    const BoardContent = {
      boardId: nanoid(),
      isCompleted: false,
      title: "",
      startDate: "",
      endDate: "",
      content: "",
    };

    if (boards && boards.contents.length > 0) {
      newContents = [...boards.contents];
      newContents.push(BoardContent);
      insertRowData(newContents);
    } else if (boards && boards.contents.length === 0) {
      newContents.push(BoardContent);
      insertRowData(newContents);
    }
  };

  // Supabase에 기존에 생성된 보드가 있는지 없는지 확인 -- 데이터 갱신
  const getData = async () => {
    const { data: todos, error, status } = await supabase.from("todos").select("*");

    if (todos !== null) {
      todos.forEach((item: Todo) => {
        if (item.id === Number(pathname.split("/"[2]))) {
          setBoards(item);
        }
      });
    }

    if (error) {
      console.log(error);
      toast({
        title: "에러가 발생했습니다.",
        description: "콘솔 창에 출력된 에러를 확인하세요",
      });
    }

    if (status === 201) {
      toast({
        title: "생성 완료!",
        description: "새로운 TO DO BOARD가 생성 되었습니다",
      });
      getData();
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.container__header}>
        <div className={styles.container__header__content}>
          <input type="text" placeholder="Enter Title Here" className={styles.input} />
          <div className={styles.progressBar}>
            <span className={styles.progressBar__status}>0/10 completed</span>
            {/* 프로그래스바 ui */}
            <Progress value={33} className="w-[30%]" indicatorColor="bg-blue-500" />
          </div>
          <div className={styles.calendarBox}>
            <div className={styles.calendarBox__calendar}>
              <LabelCalendar label="From" readonly={true} />
              <LabelCalendar label="To" />
            </div>
            <Button variant="outline" className="w-[15%] bg-orange-400 text-white border-orange-500 hover:bg-orange-400 hover:text-white" onClick={createBoard}>
              Add New Board
            </Button>
          </div>
        </div>
      </header>
      <main className={styles.container__body}>
        {boards?.contents.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className={styles.container__body__infoBox}>
              <span className={styles.title}>There is no board yet.</span>
              <span className={styles.subtitle}>Click the button and start flashing!</span>
              <Button className={styles.button}>
                <Image src="/assets/images/round-button.svg" alt="flash" width={74} height={74} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start w-full h-full gap-4">
            {boards?.contents.map((board: BoardContent) => {
              return <BasicBoard key={board.boardId} />;
            })}
          </div>
        )}
      </main>
    </div>
  );
}
