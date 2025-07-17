import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateSweet, createSweetSchema } from "@/schema/sweet";
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
import { Button } from "@/components/ui/button";
import { useCreateSweet } from "@/hooks/use-sweet-api";
import { toast } from "sonner";

interface AddSweetDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSweetDialog({ isOpen, onClose }: AddSweetDialogProps) {
  const form = useForm<CreateSweet>({
    resolver: zodResolver(createSweetSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      quantity: 0,
    },
  });

  const createMutation = useCreateSweet();

  const onSubmit = async (data: CreateSweet) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success(`Successfully added ${data.name}`);
      form.reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add sweet");
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
          <DialogTitle>Add New Sweet</DialogTitle>
          <DialogDescription>
            Enter the details for the new sweet to add to your inventory.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Sweet name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Chocolate, Candy, Pastry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
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
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Adding..." : "Add Sweet"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}