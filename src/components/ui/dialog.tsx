import type { ComponentProps } from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'

export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  overlayProps?: ComponentProps<typeof DialogPrimitive.Overlay>
  portalProps?: ComponentProps<typeof DialogPrimitive.Portal>
}

/** Dialog의 portal과 overlay를 일관된 순서로 합성한다. */
function DialogContent({
  children,
  overlayProps,
  portalProps,
  ...contentProps
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal {...portalProps}>
      <DialogPrimitive.Overlay {...overlayProps} />
      <DialogPrimitive.Content {...contentProps}>{children}</DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close
const DialogTitle = DialogPrimitive.Title
const DialogDescription = DialogPrimitive.Description

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger }
