import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

export function SectionCard({
  description,
  value,
  badge,
  badgeIcon,
  badgeText,
  footerTitle,
  footerIcon,
  footerText,
}: {
  description: string;
  value: ReactNode;
  badge?: boolean;
  badgeIcon?: ReactNode;
  badgeText?: string;
  footerTitle: string;
  footerIcon?: ReactNode;
  footerText: string;
}) {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{description}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
        {badge && (
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              {badgeIcon}
              {badgeText}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {footerTitle} {footerIcon}
        </div>
        <div className="text-muted-foreground">{footerText}</div>
      </CardFooter>
    </Card>
  );
}