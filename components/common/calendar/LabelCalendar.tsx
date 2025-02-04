"use client";

import * as React from "react";
import { useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Calendar } from "@/components/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui";

import styles from "./LabelCalendar.module.scss";

interface Props {
  label: string;
  readonly?: boolean;
  handleDate: (date: Date | undefined) => void;
}

export default function LabelCalendar({ label, readonly, handleDate }: Props) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  //   const [date, setDate] = useState<Date>(); --> import { useState } from "react";

  useEffect(() => {
    handleDate(date);
  }, [date]);

  return (
    <div className={styles.container}>
      <span className={styles.container__label}>{label}</span>
      {/* shadcn ui - Calendar */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className={cn("w-[200px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        {!readonly && (
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
