import { useEffect, useState } from "react";
import { SectionCard } from "@/components/cards/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

type CardData = {
  description: string;
  value: React.ReactNode;
  badge?: boolean;
  badgeIcon?: React.ReactNode;
  badgeText?: string;
  footerTitle: string;
  footerIcon?: React.ReactNode;
  footerText: string;
};

type SectionCardsProps = {
  role: string;
};

export function SectionCards({ role }: SectionCardsProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard/cards?role=${role}`)
      .then((res) => res.json())
      .then((data) => {
        // Optionally, map icon names to actual icon components
        const iconMap: Record<string, React.ReactNode> = {
          TrendingUpIcon: <TrendingUpIcon className="size-3" />,
          TrendingDownIcon: <TrendingDownIcon className="size-3" />,
        };
        setCards(
          data.cards.map((card: any) => ({
            ...card,
            badgeIcon: iconMap[card.badgeIcon] || null,
            footerIcon: iconMap[card.footerIcon] || null,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [role]);

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      {loading
        ? Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-40 w-full rounded-xl" />
          ))
        : cards.map((card, idx) => <SectionCard key={idx} {...card} />)}
    </div>
  );
}