import { Button } from "@/ui/button";
import { CardHeader,CardTitle ,CardDescription} from "@/ui/card";
import { Input } from "@/ui/input";
import { RefreshCw, Search, Users } from "lucide-react";

interface UserSettingsHeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  refetch: () => void;
}

export default function UserSettingsHeader({searchQuery,setSearchQuery,refetch}: UserSettingsHeaderProps) {
  return (
    <CardHeader className="text-right border-b border-border/40 bg-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="order-2 sm:order-1 flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن مستخدم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 text-right bg-background focus-visible:ring-primary/30"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="text-muted-foreground hover:text-primary shrink-0"
              title="تحديث القائمة"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="order-1 sm:order-2">
            <CardTitle className="text-lg flex items-center gap-2 justify-end">
              <Users className="w-5 h-5 text-primary" /> إدارة المستخدمين
            </CardTitle>
            <CardDescription className="text-right">
              إدارة صلاحيات وصول الصيادلة والموظفين للنظام.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
  )
}
