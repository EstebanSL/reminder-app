import { UserButton } from "@clerk/nextjs";
import React from "react";
import { Logo } from "./logo";
import { ThemeSwitcher } from "./themeSwitcher";

export const Navbar = () => {
  return (
    <div className="flex w-full items-center justify-between p-4 px-8 h-[60px]">
      <Logo />
      <div className="flex gap-2 items-center ml-auto">
        <UserButton afterSignOutUrl="/" />
        <ThemeSwitcher />
      </div>
    </div>
  );
};
