import type { ComponentProps } from 'react'

import * as SelectPrimitive from '@radix-ui/react-select'

export type SelectContentProps = ComponentProps<typeof SelectPrimitive.Content> & {
  portalProps?: ComponentProps<typeof SelectPrimitive.Portal>
  viewportProps?: ComponentProps<typeof SelectPrimitive.Viewport>
}

/** Select content를 기본 portal과 viewport로 합성한다. */
function SelectContent({
  children,
  portalProps,
  viewportProps,
  ...contentProps
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal {...portalProps}>
      <SelectPrimitive.Content {...contentProps}>
        <SelectPrimitive.Viewport {...viewportProps}>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

const Select = SelectPrimitive.Root
const SelectTrigger = SelectPrimitive.Trigger
const SelectValue = SelectPrimitive.Value
const SelectIcon = SelectPrimitive.Icon
const SelectGroup = SelectPrimitive.Group
const SelectLabel = SelectPrimitive.Label
const SelectItem = SelectPrimitive.Item
const SelectItemText = SelectPrimitive.ItemText
const SelectItemIndicator = SelectPrimitive.ItemIndicator
const SelectSeparator = SelectPrimitive.Separator

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
