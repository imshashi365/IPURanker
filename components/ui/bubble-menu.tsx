import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "./button"

interface BubbleButtonProps extends ButtonProps {
  active?: boolean
  title: string
}

export const BubbleButton = ({
  className,
  active,
  title,
  ...props
}: BubbleButtonProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 p-0 flex items-center justify-center rounded-md",
        active ? "bg-gray-200" : "hover:bg-gray-100",
        className
      )}
      title={title}
      {...props}
    />
  )
}
