import type { ComponentProps } from 'react'

import * as PopoverPrimitive from '@radix-ui/react-popover'

export type PopoverContentProps = ComponentProps<typeof PopoverPrimitive.Content> & {
  portalProps?: ComponentProps<typeof PopoverPrimitive.Portal>
}

/** Popover content를 기본 portal에 배치한다. */
function PopoverContent({ children, portalProps, ...contentProps }: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal {...portalProps}>
      <PopoverPrimitive.Content {...contentProps}>{children}</PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor
const PopoverClose = PopoverPrimitive.Close
const PopoverArrow = PopoverPrimitive.Arrow

export { Popover, PopoverAnchor, PopoverArrow, PopoverClose, PopoverContent, PopoverTrigger }
