// /create 경로에서 렌더링되는 내용 중 게시물 리스트를 나타내는 Card 컴포넌트
// components 디렉토리는 재사용 가능한 UI 컴포넌트들을 모아두는 곳으로, 이러한 컴포넌트들은 다른 곳에서 import하여 사용할 수 있다.

import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { usePathname } from "next/navigation";
import styles from "./BasicBoard.module.scss";

import { useToast } from "@/hooks/use-toast";
import { ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Card } from "@/components/ui";
import MDEditor from "@uiw/react-md-editor";

import LabelCalendar from "@/components/common/calendar/LabelCalendar";
import MarkdownDialog from "@/components/common/dialog/MarkdownDialog";

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
  content: string; // 에디터 안의 입력 데이터 컨텐츠
}

interface Props {
  data: BoardContent;
  handleBoards: (data: Todo) => void;
}

// export default function BasicBoard({ data, handleBoards }: Props): JSX.Element {
export default function BasicBoard({ data, handleBoards }: Props) {
  // const [startDate, setStartDate] = useState<Date>();
  // const [endDate, setEndDate] = useState<Date>();

  const pathname = usePathname();
  const { toast } = useToast();

  const handleDelete = async (id: string | number) => {
    console.log("handleDelete 출력 확인");

    // 해당 Board ID에 대한 데이터만 수정 혹은 삭제
    let { data: todos } = await supabase.from("todos").select("*"); // 모든 데이터 호출

    if (todos !== null) {
      todos.forEach(async (item: Todo) => {
        if (item.id === Number(pathname.split("/")[2])) {
          console.log(item);

          let newContents = item.contents.filter((element: BoardContent) => {
            return element.boardId !== id; // 아이디가 일치 하지 않으면 선택하지 않음음
          });

          // Supabase에 다시 저장
          const { data, error, status } = await supabase
            .from("todos")
            .update({
              contents: newContents,
            })
            .eq("id", pathname.split("/")[2]); // 아이디와 == pathname 같으면 contents 업데이트

          if (error) {
            console.log(error);
            toast({
              title: "에러가 발생했습니다.",
              description: "콘솔 창에 출력된 에러를 확인하세요",
            });
          }

          if (status === 204) {
            console.log("status 204", status);
            toast({
              title: "삭제가 완료되었습니다다",
              description: "Supabase에서 삭제 되었습니다",
            });
            getData();
          }
        } else {
          return;
        }
      });
    }
  };

  // Supabse에 기존에 생성된 보드가 있는지 없는지 확인
  // const getData = async () => {
  //   const { data: todos } = await supabase.from("todos").select("*");

  //   if (todos !== null) {
  //     todos.forEach((item: Todo) => {
  //       if (item.id === Number(pathname.split("/")[2])) {
  //         handleBoards(item);
  //       }
  //     });
  //   }
  // };

  // Supabase에 기존에 생성된 보드가 있는지 없는지 확인 -> 데이터 갱신
  const getData = async () => {
    let { data: todos, error } = await supabase.from("todos").select("*"); // 전체 데이터 다 가져오기

    if (error) {
      toast({
        title: "데이터 로드 실패패.",
        description: "데이터르르 불러오는 중 실패했습니다",
      });
      return;
    }

    if (todos === null || todos.length === 0) {
      toast({
        title: "조회가능한 데이터가 없습니다.",
        description: "조회가능한 데이터가 없습니다.",
      });
      return;
    }

    todos.forEach((item: Todo) => {
      if (item.id === Number(pathname.split("/")[2])) {
        handleBoards(item);
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__header}>
        <div className={styles.container__header__titleBox}>
          {/* shadcn ui - checkBox */}
          <Checkbox className="w-5 h-5" />
          {data.title !== "" ? <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{data.title}</h3> : <span className={styles.title}>Please Enter a Title for the Board</span>}
        </div>
        <Button variant={"ghost"}>
          <ChevronUp size={20} className="text-gray-400" />
        </Button>
      </div>
      <div className={styles.container__body}>
        <div className={styles.container__body__calendarBox}>
          {/* <LabelCalendar label="From" /> <LabelCalendar label="To" /> */}
          <div className="flex items-center gap-3">
            <span className="text-[#6d6d6d]">Form</span>
            {/* <Input value={typeof data.startDate === "string" && data.startDate !== "" ? data.startDate.split("T")[0] : "pick a date"} disabled /> */}
            <Input value={data.startDate !== "" ? data.startDate.split("T")[0] : "pick a date"} disabled />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#6d6d6d]">To</span>
            <Input value={data.endDate !== "" ? data.endDate.split("T")[0] : "pick a date"} disabled />
          </div>
        </div>
        <div className={styles.container__body__buttonBox}>
          <Button variant={"ghost"} className="font-normal text-gray-400 hover:bg-green-50 hover:text-green-500">
            Duplicate
          </Button>

          <Button variant={"ghost"} className="font-normal text-gray-400 hover:bg-red-50 hover:text-red-500" onClick={() => handleDelete(data.boardId)}>
            Delete
          </Button>
        </div>
      </div>
      {data.content && (
        <Card className="w-full p-4 mb-3">
          <MDEditor value={data.content} height={100 + "%"} />
        </Card>
      )}
      <div className={styles.container__footer}>
        {/* Add Contents 컴포넌트 */}
        {/* 이 컴포넌트에서 Add Contents 버튼을 클릭하면 게시글 작성 모달이 표시된다 */}
        <MarkdownDialog data={data} updateBoards={getData} />
      </div>
    </div>
  );
}
