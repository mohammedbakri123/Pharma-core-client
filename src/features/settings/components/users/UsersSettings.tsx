import React from "react";
import UserHeader from "./UserHeader";
import UserTable from "./UserTable";
import { Card } from "@/ui/card";
import UserFooter from "./UserFooter";
import CreateEditUserForm from "./CreateEditUserForm";

export default function UsersSettings() {
  return (
    <div>
      <Card>
        <UserHeader />
        <UserTable />
        <UserFooter />
      </Card>
    </div>
  );
}
