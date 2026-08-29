import type { ComponentProps } from 'react'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

export type AlertDialogContentProps = ComponentProps<typeof AlertDialogPrimitive.Content> & {
  overlayProps?: ComponentProps<typeof AlertDialogPrimitive.Overlay>
  portalProps?: ComponentProps<typeof AlertDialogPrimitive.Portal>
}

/** AlertDialog의 portal과 overlay를 일관된 순서로 합성한다. */
function AlertDialogContent({
  children,
  overlayProps,
  portalProps,
  ...contentProps
}: AlertDialogContentProps) {
  return (
    <AlertDialogPrimitive.Portal {...portalProps}>
      <AlertDialogPrimitive.Overlay {...overlayProps} />
      <AlertDialogPrimitive.Content {...contentProps}>{children}</AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  )
}

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogCancel = AlertDialogPrimitive.Cancel
const AlertDialogAction = AlertDialogPrimitive.Action
const AlertDialogTitle = AlertDialogPrimitive.Title
const AlertDialogDescription = AlertDialogPrimitive.Description

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
}
