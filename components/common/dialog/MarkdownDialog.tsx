"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase";
import MDEditor from "@uiw/react-md-editor";

import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/components/ui/use-toast";
import { useToast } from "@/hooks/use-toast";

// import LabelCalendar from "@/components/common/calendar/LabelCalendar"; // export default function LabelCalendar
import LabelCalendar from "../calendar/LabelCalendar"; // export default function LabelCalendar
import styles from "./MarkdownDialog.module.scss";

interface Todo {
  id: number;
  title: string;
  start_date: string | Date;
  end_date: string | Date;
  contents: BoardContent[];
}

interface BoardContent {
  boardId: string | number;
  isCompleted: boolean; // checkBox
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  content: string;
}

interface Props {
  data: BoardContent;
}

export default function MarkdownDialog({ data }: Props) {
  // const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false); // 반응성을 가진 데이터

  /** 상태 값 선언 */
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string | undefined>("**Hello, World!!**");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  // const [isCompleted, setIsCompleted] = useState<boolean>(false);
  // const [title, setTitle] = useState<string>("");
  // const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  // const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  // const [content, setContent] = useState<string>("**Hello, World!!**");
  // const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // supabase 저장
  const onSubmit = async (id: string | number) => {
    console.log("onSubmit 함수 호출");
    // !title || !startDate || !endDate || !content
    if (!title || !content || !startDate || !endDate) {
      toast({
        title: "기입되지 않은 데이터(값)가 있습니다.",
        description: "제목 날짜 혹은 콘텐츠 값을 모두 작성 해주세요!",
      });
      return;
    } else {
      // 해당 보드에 대한 데이터만 수정이 된다
      let { data: todos } = await supabase.from("todos").select("*");

      if (todos !== null) {
        todos.forEach(async (item: Todo) => {
          if (item.id === Number(pathname.split("/")[2])) {
            // http://localhost:3000/create/78  -> 0 / 1 / 2
            item.contents.forEach((element: BoardContent) => {
              // element.boardId === "Done 버튼을 클릭했을떄 해당되는 id값과 같으면"
              // if (element.boardId === "-_qElqCyXqVyxMa1VNwgZ") {
              if (element.boardId === id) {
                element.title = title;
                element.content = content;
                element.startDate = startDate;
                element.endDate = endDate;
              } else {
                element.title = element.title;
                element.content = element.content;
                element.startDate = element.startDate;
                element.endDate = element.endDate;
              }
            });

            // Supabase 데이터 베이스 연동
            const { data, error, status } = await supabase
              .from("todos")
              // .insert([{ title: title, content: content }]).select()
              .update([{ contents: item.contents }])
              .eq("id", pathname.split("/")[2]);

            if (error) {
              console.log(error);
              toast({
                title: "에러가 발생했습니다.",
                description: "콘설창에 출력된 에러를 확인하세요!",
              });
            }

            if (status === 204) {
              console.log(data);
              toast({
                title: "수정 완료",
                description: "데이터로로 작성한 글이 Supabase에 저장되었습니다.",
              });

              // 등록 후 조건 초기화
              setOpen(false);
            }
          }
        });
      } else {
        return;
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button variant={"ghost"} className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">
          Add Contents
        </Button>
      </DialogTrigger> */}
      {data.title ? (
        <DialogTrigger asChild>
          <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">Update Contents</span>
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">Add Contents</span>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle className={styles.dialog__titleBox}>
            <Checkbox className="w-5 h-5" />
            <input
              type="text"
              placeholder="write a title for your board."
              value={data.title ? data.title : title}
              className={styles.dialog__titleBox__title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </DialogTitle>
          {/* <DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</DialogDescription> */}
          <div className={styles.dialog__calendarBox}>
            <LabelCalendar label="From" handleDate={setStartDate} />
            <LabelCalendar label="To" handleDate={setEndDate} />
          </div>
          <Separator />
          <div className={styles.dialog__markdown}>
            {/* <MDEditor height={100 + "%"} value={content} onChange={setContent} /> */}
            <MDEditor height={100 + "%"} value={data.content ? data.content : content} onChange={setContent} />
          </div>
        </DialogHeader>

        <DialogFooter>
          <div className={styles.dialog__buttonBox}>
            <DialogClose asChild>
              <Button variant={"ghost"} className="font-normal text-gray-400 hover:bg-gray-50 hover:text-gray-500">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant={"ghost"}
              className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
              // onClick={onSubmit}
              onClick={() => onSubmit(data.boardId)}>
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
