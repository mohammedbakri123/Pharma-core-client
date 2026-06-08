import React from "react";
import UserHeader from "./UserHeader";
import UserTable from "./UserTable";
import { Card } from "@/ui/card";

export default function UsersSettings() {
  return (
    <div>
      <Card>
        <UserHeader />
        <UserTable />
      </Card>
    </div>
  );
}
