import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormData } from "./MiniPCForm";
import { FormDataDetailsView } from "./FormDataDetailsView";
import { Save } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: FormData;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  formData,
  isLoading = false,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-6xl max-h-[85vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Confirm MiniPC Creation</DialogTitle>
          <DialogDescription>
            Please review the information below before creating the MiniPC entry.
          </DialogDescription>
        </DialogHeader>

        <FormDataDetailsView formData={formData} showTitle={true} />

        <DialogFooter className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            <Save className="h-4 w-4" /> {isLoading ? "Creating..." : "Create MiniPC"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}