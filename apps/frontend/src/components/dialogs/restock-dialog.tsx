import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRestockSweet } from "@/hooks/use-sweet-api";
import { type RestockQuantity, restockQuantitySchema } from "@/schema/sweet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface RestockDialogProps {
  sweetId: number;
  sweetName: string;
  currentQuantity: number;
  isOpen: boolean;
  onClose: () => void;
}

export function RestockDialog({
  sweetId,
  sweetName,
  currentQuantity,
  isOpen,
  onClose,
}: RestockDialogProps) {
  const form = useForm<RestockQuantity>({
    resolver: zodResolver(restockQuantitySchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const restockMutation = useRestockSweet();

  const onSubmit = async (data: RestockQuantity) => {
    try {
      await restockMutation.mutateAsync({
        id: sweetId,
        quantity: data.quantity,
      });
      toast.success(`Successfully restocked ${data.quantity} ${sweetName}(s)`);
      form.reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Restock failed");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restock {sweetName}</DialogTitle>
          <DialogDescription>
            Enter the quantity to add to inventory (Current: {currentQuantity})
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity to Add</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={restockMutation.isPending}>
                {restockMutation.isPending ? "Restocking..." : "Restock"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
