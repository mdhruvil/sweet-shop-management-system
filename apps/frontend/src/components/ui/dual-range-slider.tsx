import { Slider } from "@/components/ui/slider";

interface DualRangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string;
  className?: string;
}

export function DualRangeSlider({
  min,
  max,
  step,
  value,
  onValueChange,
  formatLabel = (val) => val.toString(),
  className,
}: DualRangeSliderProps) {
  return (
    <div className={className}>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{formatLabel(min)}</span>
        <span>{formatLabel(max)}</span>
      </div>
    </div>
  );
}
