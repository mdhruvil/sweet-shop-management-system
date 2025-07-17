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
import { usePurchaseSweet } from "@/hooks/use-sweet-api";
import { type PurchaseQuantity, purchaseQuantitySchema } from "@/schema/sweet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PurchaseDialogProps {
  sweetId: number;
  sweetName: string;
  availableQuantity: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseDialog({
  sweetId,
  sweetName,
  availableQuantity,
  isOpen,
  onClose,
}: PurchaseDialogProps) {
  const form = useForm<PurchaseQuantity>({
    resolver: zodResolver(purchaseQuantitySchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const purchaseMutation = usePurchaseSweet();

  const onSubmit = async (data: PurchaseQuantity) => {
    if (data.quantity > availableQuantity) {
      form.setError("quantity", {
        message: `Only ${availableQuantity} items available`,
      });
      return;
    }

    try {
      await purchaseMutation.mutateAsync({
        id: sweetId,
        quantity: data.quantity,
      });
      toast.success(`Successfully purchased ${data.quantity} ${sweetName}(s)`);
      form.reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Purchase failed");
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
          <DialogTitle>Purchase {sweetName}</DialogTitle>
          <DialogDescription>
            Enter the quantity you want to purchase (Available:{" "}
            {availableQuantity})
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
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
              <Button type="submit" disabled={purchaseMutation.isPending}>
                {purchaseMutation.isPending ? "Purchasing..." : "Purchase"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
