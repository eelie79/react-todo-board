import * as React from "react";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// const SearchBar = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {

const SearchBar = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    // <input
    //   type={type}
    //   className={cn(
    //     "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    //     className
    //   )}
    //   ref={ref}
    //   {...props}
    // />

    <div className={cn("flex w-full h-10 items-center rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-ring focus-within:ring-offset-2, className")}>
      <SearchIcon className="h-[18px] w-[18px]" />
      <input {...props} type="search" ref={ref} className="w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" />
    </div>
  );
});
SearchBar.displayName = "SearchBar";

export { SearchBar };
