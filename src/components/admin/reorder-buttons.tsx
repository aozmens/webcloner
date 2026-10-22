import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { buttonClass } from "./ui";

/** Drag handle (desktop) plus ↑/↓ buttons (touch screens). */
export function ReorderButtons({ index, count, onMove, label }: { index: number; count: number; onMove: (from: number, to: number) => void; label: string }) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <GripVertical className="hidden size-4 cursor-grab text-neutral-400 sm:block" aria-hidden />
      <button type="button" className={buttonClass.icon} disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label={`${label}: yukarı taşı`}>
        <ArrowUp aria-hidden />
      </button>
      <button type="button" className={buttonClass.icon} disabled={index === count - 1} onClick={() => onMove(index, index + 1)} aria-label={`${label}: aşağı taşı`}>
        <ArrowDown aria-hidden />
      </button>
    </div>
  );
}
