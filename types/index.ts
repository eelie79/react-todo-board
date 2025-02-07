export interface Task {
  // supabase row 데이터 타입
  id: number;
  title: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
  contents: Board[];
}

export interface Board {
  id: string;
  title: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  content: string;
  isCompleted: boolean; // checkBox
}
