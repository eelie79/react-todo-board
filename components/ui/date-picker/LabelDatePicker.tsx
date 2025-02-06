"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar, Button, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";

interface Props {
  label: string;
  readonly?: boolean;
  value: Date | undefined;
  onChange?: (date: Date | undefined) => void; // 조회용 이라 값이 없을수 있다
}

export function LabelDatePicker({ label, readonly, value, onChange }: Props) {
  // const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="max-w-64 items-center gap-3">
      <span className="text-sm font-medium leading-none text-[#6d6d6d] pr-2">{label}</span>
      {/* shadcn ui - Calendar */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className={cn("w-[200px] justify-start text-left font-normal", !value && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {/* {value ? format(value, "PPP") : <span>날짜를 선택하세요</span>} */}
            {value ? format(value, "PPP") : <span>날짜를 선택하세요</span>}
          </Button>
        </PopoverTrigger>
        {!readonly && (
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
