"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { nanoid } from "nanoid";
// import { useAtom } from "jotai";
// import { sidebarStateAtom } from "@/store";
import { toast, useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";

import { Task, Board } from "@/types";
import { useCreateBoard, useGetTaskById, useGetTasks } from "@/hooks/apis";
import { Button, Progress, LabelDatePicker } from "@/components/ui";
import { BoardCard, DeleteTaskPopup } from "@/components/common";
import { ChevronLeft } from "lucide-react";

import styles from "./page.module.scss";
import Image from "next/image";

export default function TaskPage() {
  const router = useRouter();
  const { id } = useParams();
  const { task, getTaskById } = useGetTaskById(Number(id)); // 특정 id 단일 TASK 데이터 조회
  const createBoard = useCreateBoard(); // 보더 컨텐츠 값을 받아서 supabase에 저장 insertRowData(newContents);
  const { getTasks } = useGetTasks();

  // const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom);
  const [title, setTitle] = useState<string>("");
  // TODO 전체 boards 데이터 Todo | (() => Todo) 브라우져가 초기화 되면 데이터 날아감
  const [boards, setBoards] = useState<Board[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setStartDate(task.start_date ? new Date(task.start_date) : undefined);
      setEndDate(task.end_date ? new Date(task.end_date) : undefined);
      setBoards(task.contents); // 데이터 베이스 contents에 보드 데이터 입력
    }
  }, [task]);

  /* Task 내의 Board 생성 */
  // ADD NEW BOARD 버튼을 클릭하였을떄
  const handleAddBoard = () => {
    // let newContents: Board[] = []; // 보드컨텐츠 만 담기는 배열

    // 보드 컨텐츠 입력 객체 리터럴 초기값
    const newBoard: Board = {
      id: nanoid(),
      isCompleted: true,
      title: "",
      startDate: undefined,
      endDate: undefined,
      content: "",
    };

    const newBoards = [...boards, newBoard];
    setBoards(newBoards);
    // createBoard(taskId, "컬럼명 boards", newBoards); // 기존 insertRowData
    createBoard(Number(id), "contents", newBoards); // 실제 Supabase와 통신하는 로직 hook
  };

  const handleSave = async () => {
    // 24강 handleSave 타이틀 날짜 저장
    if (!title || !startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "기입되지 않은 데이터(값)가 있습니다.",
        description: "제목, 시작일, 종료일은 필수값 입니다.",
      });
      return; // 리턴하지 않으면 조건 성립안해도 넘어감 -> 함수종료 해줘야함
    }

    try {
      const { data, error, status } = await supabase
        .from("todos")
        .update({
          // 데이터 베이스 테이블 명 키 : 작업 상태관리 값
          title: title,
          start_date: startDate,
          end_date: endDate,
        })
        .eq("id", id)
        .select();

      if (data && status === 200) {
        /* tasks 테이블에 ROW 데이터 한 줄이 올바르게 생성되면 실행 */
        toast({
          title: "TASK 저장을 완료하였습니다.",
          description: "수정한 TASK의 일정 Date를 꼭 지켜주세요!",
        });
        /**  서버에서 데이터 갱신후 상태값 실시간 반영영 저장
         *   SideNavigation 컴포넌트 리스트 정보를 실시간으로 업데이트 하기 위해 getTasks 함수를 호출
         * **/
        getTasks();
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

  useEffect(() => {
    if (task?.contents) {
      const completedCount = task.contents.filter((board: Board) => {
        board.isCompleted;
      }).length;
      setCount(completedCount);
    }
  }, [task?.contents]);

  const handleDelete = () => {};

  return (
    <>
      <div className={styles.header}>
        <div className={styles[`header__btn-box`]}>
          <Button variant={"outline"} size={"icon"} onClick={() => router.push("/")}>
            <ChevronLeft />
          </Button>
          <div className="flex items-center gap-2">
            {/* 타이틀 날짜 저장 */}
            <Button variant={"secondary"} onClick={handleSave}>
              저장
            </Button>
            <DeleteTaskPopup>
              <Button className="text-rose-600 bg-red-50 hover:bg-rose-50">삭제 {/* onClick={handleDelete} */}</Button>
            </DeleteTaskPopup>
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
            {/* <small className="text-sm font-medium leading-none text-[#6d6d6d]">1/10 Completed!</small> */}
            <small className="text-sm font-medium leading-none text-[#6d6d6d]">
              {count}/{task?.contents.length} Completed!
            </small>
            <Progress className="w-60 h-[10px]" value={task && task.contents.length > 0 ? (count / task.contents.length) * 100 : 0} indicatorColor={"bg-[#0cf5ce]"} />
          </div>
        </div>
        {/* 캘린더 + ADD New Board 버튼 섹션션 */}
        <div className={styles.header__bottom}>
          <div className="flex items-center gap-5">
            {/* 날짜 조회용으로 onChangeg함수 필요없음 value 데이터만 들어감 onChange? */}
            <LabelDatePicker label={"From"} value={startDate} onChange={setStartDate} /> /
            <LabelDatePicker label={"To"} value={endDate} onChange={setEndDate} />
            {/* 현제날짜보다 이전 선택이 안되게 해야하는데 패쓰 */}
          </div>
          <Button
            className="text-white bg-[#E79057] hover:bg-[#E79057] hover:ring-1 hover:ring-[#E79057] 
        hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg"
            onClick={handleAddBoard}>
            ADD NEW BOARD
          </Button>
        </div>
      </div>

      <div className={styles.body}>
        {boards.length !== 0 ? (
          <div className={styles.body__isData}>
            {/* Add New Board 버튼 클릭으로 인한 Board content 데이터가 있는 경우 */}
            {boards.map((board: Board) => {
              return <BoardCard key={board.id} board={board} />;
            })}
          </div>
        ) : (
          <div className={styles.body__noData}>
            {/* Add New Board 버튼 클릭으로 인한 Board content 데이터가 없는 경우 */}
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">There is no board yet.</h3>
            <small className="text-sm font-medium leading-none text-[#6d6d6d] mt-3 mb-10">click the button and start flashing!</small>
            <Button variant={"ghost"} onClick={handleAddBoard}>
              {/* <Image src={"/public/assets/images/round-button.svg"} width={74} height={74} alt="rounded-button" /> */}
              {/* <Image src="/assets/images/button.svg" width={74} height={74} alt="rounded-button" /> */}
              <Image src={"/assets/images/round-button.svg"} width={74} height={74} alt="rounded-button" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
