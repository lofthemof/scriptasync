"use client";

import { useRouter } from "next/router";

interface HeaderProps {
  signedIn: boolean;
}

export const Header = ({ signedIn }: HeaderProps) => {
  return (
    <div className="flex gap-4 p-4">
      <div>ScriptAsync</div>
      <div>Read</div>
      <div>Groups</div>
      {signedIn ?? <div>Me</div>}
      <div>Sign {signedIn ? "Out" : "In"}</div>
    </div>
  );
};
