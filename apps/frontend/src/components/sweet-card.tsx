import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import type { Sweet } from "@/schema/sweet";
import { Package, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { PurchaseDialog } from "./dialogs/purchase-dialog";
import { RestockDialog } from "./dialogs/restock-dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface SweetCardProps {
  sweet: Sweet;
}

export function SweetCard({ sweet }: SweetCardProps) {
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);

  const handlePurchaseClick = () => {
    if (sweet.quantity === 0) {
      return;
    }
    setIsPurchaseDialogOpen(true);
  };

  const handleRestockClick = () => {
    setIsRestockDialogOpen(true);
  };

  return (
    <>
      <Card className="">
        <CardContent className="space-y-2">
          <CardDescription className="text-xs">
            Sweet#{sweet.id}
          </CardDescription>
          <CardTitle className="line-clamp-2">{sweet.name}</CardTitle>
          <Badge variant="secondary">{sweet.category}</Badge>
          <div>
            <p className="text-lg font-bold">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(sweet.price)}
            </p>
            <p
              className={`text-sm ${sweet.quantity === 0 ? "text-red-500" : "text-muted-foreground"}`}
            >
              {sweet.quantity === 0
                ? "Out of stock"
                : `${sweet.quantity} available`}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button
            className="grow flex items-center gap-2"
            onClick={handlePurchaseClick}
            disabled={sweet.quantity === 0}
            variant="outline"
          >
            <ShoppingCart className="h-4 w-4" />
            Purchase
          </Button>
          <Button
            variant="outline"
            className="grow flex items-center gap-2"
            onClick={handleRestockClick}
          >
            <Package className="h-4 w-4" />
            Restock
          </Button>
        </CardFooter>
      </Card>

      <PurchaseDialog
        sweetId={sweet.id}
        sweetName={sweet.name}
        availableQuantity={sweet.quantity}
        isOpen={isPurchaseDialogOpen}
        onClose={() => setIsPurchaseDialogOpen(false)}
      />

      <RestockDialog
        sweetId={sweet.id}
        sweetName={sweet.name}
        currentQuantity={sweet.quantity}
        isOpen={isRestockDialogOpen}
        onClose={() => setIsRestockDialogOpen(false)}
      />
    </>
  );
}
