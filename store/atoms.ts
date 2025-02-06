import { atom } from "jotai";
import { Task } from "@/types";

// export const sidebarStateAtom = atom<string>("default"); // 기본값 설정

/* 전체 Task 목록 조회 */
export const tasksAtom = atom<Task[]>([]);

/* 단일(개별) Task 조회 */
export const taskAtom = atom<Task | null>(null);
