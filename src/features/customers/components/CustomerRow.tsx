import { TableRow, TableCell } from "@/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Phone, Mail } from "lucide-react";

export default function CustomerRow({ customer }: any) {
  return (
    <TableRow className="group hover:bg-muted/50 transition-colors cursor-pointer text-right">
      {/* Customer */}
      <TableCell>
        <div className="flex items-center gap-3 justify-start">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`}
            />
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="text-right">
            <div className="font-medium">{customer.name}</div>
            <div className="text-xs text-muted-foreground">
              {customer.age} سنة • معرف: #{1000 + customer.id}
            </div>
          </div>
        </div>
      </TableCell>

      {/* Contact */}
      <TableCell>
        <div className="space-y-1 text-right">
          <div className="flex items-center justify-start text-xs text-muted-foreground">
            <Phone className="w-3 h-3 ml-1" /> {customer.phone}
          </div>
          <div className="flex items-center justify-start text-xs text-muted-foreground">
            <Mail className="w-3 h-3 ml-1" /> {customer.email}
          </div>
        </div>
      </TableCell>

      {/* Condition */}
      <TableCell>
        {customer.condition !== "لا يوجد" ? (
          <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-50">
            {customer.condition}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>

      {/* Last Visit */}
      <TableCell className="text-sm text-muted-foreground">
        {customer.lastVisit}
      </TableCell>

      {/* Status */}
      <TableCell>
        <div className="flex items-center justify-start">
          <div
            className={`w-2 h-2 rounded-full inline-block ml-2 ${
              customer.status === "نشط" ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <span className="text-sm">{customer.status}</span>
        </div>
      </TableCell>

      {/* Action */}
      <TableCell className="text-left">
        <Button variant="ghost" size="sm">
          عرض الملف
        </Button>
      </TableCell>
    </TableRow>
  );
}
