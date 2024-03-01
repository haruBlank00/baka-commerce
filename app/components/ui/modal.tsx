import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "~/components/ui/dialog";

type ModalProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footer?: () => JSX.Element;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};
export const Modal = ({
  isOpen,
  title,
  description,
  className,
  children,
  footer: Footer,
  onOpenChange,
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {title && <DialogHeader>{title}</DialogHeader>}

          {description && <DialogDescription>{description}</DialogDescription>}

          <div className={className}>{children}</div>
        </DialogHeader>

        {Footer && <DialogFooter>{<Footer />}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
