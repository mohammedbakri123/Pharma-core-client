import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import ThemeToggle from "@/ui/ThemeToggle";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-muted/40 p-4"
      dir="rtl"
    >
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-lg border border-border">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
