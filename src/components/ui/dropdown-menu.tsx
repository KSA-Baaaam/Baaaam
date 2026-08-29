import type { ComponentProps } from 'react'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

export type DropdownMenuContentProps = ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  portalProps?: ComponentProps<typeof DropdownMenuPrimitive.Portal>
}

/** DropdownMenu content를 기본 portal에 배치한다. */
function DropdownMenuContent({
  children,
  portalProps,
  ...contentProps
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal {...portalProps}>
      <DropdownMenuPrimitive.Content {...contentProps}>{children}</DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuLabel = DropdownMenuPrimitive.Label
const DropdownMenuItem = DropdownMenuPrimitive.Item
const DropdownMenuCheckboxItem = DropdownMenuPrimitive.CheckboxItem
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup
const DropdownMenuRadioItem = DropdownMenuPrimitive.RadioItem
const DropdownMenuItemIndicator = DropdownMenuPrimitive.ItemIndicator
const DropdownMenuSeparator = DropdownMenuPrimitive.Separator
const DropdownMenuArrow = DropdownMenuPrimitive.Arrow
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuSubTrigger = DropdownMenuPrimitive.SubTrigger
const DropdownMenuSubContent = DropdownMenuPrimitive.SubContent

export {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
