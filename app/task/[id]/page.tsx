"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { nanoid } from "nanoid";
// import { useAtom } from "jotai";
// import { sidebarStateAtom } from "@/store";

import { Task, Board } from "@/types";
import { Button, Progress, LabelDatePicker } from "@/components/ui";
import { useCreateBoard, useGetTaskById } from "@/hooks/apis";
import { BoardCard, DeleteTaskPopup } from "@/components/common";
import { ChevronLeft } from "lucide-react";

import styles from "./page.module.scss";
import Image from "next/image";

export default function TaskPage() {
  const router = useRouter();
  const { id } = useParams();
  const { task, getTaskById } = useGetTaskById(Number(id)); // 특정 id 단일 TASK 데이터 조회
  const createBoard = useCreateBoard(); // 보더 컨텐츠 값을 받아서 supabase에 저장 insertRowData(newContents);

  // const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom);
  const [title, setTitle] = useState<string>("");
  // TODO 전체 boards 데이터 Todo | (() => Todo) 브라우져가 초기화 되면 데이터 날아감
  const [boards, setBoards] = useState<Board[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

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
  };

  const handleDelete = () => {};

  return (
    <>
      <div className={styles.header}>
        <div className={styles[`header__btn-box`]}>
          <Button variant={"outline"} size={"icon"} onClick={() => router.push("/")}>
            <ChevronLeft />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant={"secondary"} onClick={handleSave}>
              저장
            </Button>
            <DeleteTaskPopup>
              <Button className="text-rose-600 bg-red-50 hover:bg-rose-50">
                삭제
                {/* onClick={handleDelete} */}
              </Button>
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
            <small className="text-sm font-medium leading-none text-[#6d6d6d]">1/10 Completed!</small>
            <Progress className="w-60 h-[10px]" value={33} indicatorColor={"bg-[#0cf5ce]"} />
          </div>
        </div>
        {/* 캘린더 + ADD New Board 버튼 섹션션 */}
        <div className={styles.header__bottom}>
          <div className="flex items-center gap-5">
            {/* 날짜 조회용으로 onChangeg함수 필요없음 value 데이터만 들어감 onChange? */}
            <LabelDatePicker label={"From"} value={startDate} /> /
            <LabelDatePicker label={"To"} value={endDate} />
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
