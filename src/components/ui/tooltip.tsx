import type { ComponentProps } from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'

export type TooltipContentProps = ComponentProps<typeof TooltipPrimitive.Content> & {
  portalProps?: ComponentProps<typeof TooltipPrimitive.Portal>
}

/** Tooltip content를 기본 portal에 배치한다. */
function TooltipContent({ children, portalProps, ...contentProps }: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal {...portalProps}>
      <TooltipPrimitive.Content {...contentProps}>{children}</TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipArrow = TooltipPrimitive.Arrow

export { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger }
