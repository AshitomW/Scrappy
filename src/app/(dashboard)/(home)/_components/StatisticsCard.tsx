import ReactCountWrapper from "@/components/ReactCountUpWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

export default function StatisticsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
}) {
  const Icon = icon;
  return (
    <Card className="relative overflow-hidden h-full rounded-md">
      <CardHeader className="flex pb-2">
        <CardTitle>{title}</CardTitle>
        <Icon
          size={120}
          className="text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <ReactCountWrapper value={value} />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatisticsCardSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full min-h-[120px]" />
      ))}
    </div>
  );
}
