import { AddSweetDialog } from "@/components/dialogs/add-sweet-dialog";
import { SearchSweets } from "@/components/search-sweets";
import { SweetCard } from "@/components/sweet-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { useCreateMultipleSweets, useSweets } from "@/hooks/use-sweet-api";
import { generateDummySweets } from "@/lib/dummy-data";
import type { Sweet } from "@/schema/sweet";
import { AlertCircle, Database, Loader2, Plus, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SweetShop() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Sweet[] | null>(null);

  const { data: allSweets, isLoading, error, isError } = useSweets();
  const createMultipleMutation = useCreateMultipleSweets();

  const sweetsToDisplay = Array.isArray(searchResults)
    ? searchResults
    : Array.isArray(allSweets)
      ? allSweets
      : [];
  const isSearchActive = searchResults !== null;

  const handleSearchResults = (results: Sweet[] | null) => {
    setSearchResults(results);
  };

  const handleAddDummyData = async () => {
    try {
      const dummySweets = generateDummySweets(25);
      await createMultipleMutation.mutateAsync(dummySweets);
      toast.success("Successfully added 25 dummy sweets!");
    } catch (error) {
      toast.error("Failed to add dummy data");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading sweets...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <span>Error loading sweets</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error
                ? error.message
                : "Unknown error occurred"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              <h1 className="text-xl font-bold">Sweet Shop Management</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddDummyData}
                variant="outline"
                className="flex items-center gap-2"
                disabled={createMultipleMutation.isPending}
              >
                <Database className="h-4 w-4" />
                {createMultipleMutation.isPending
                  ? "Adding..."
                  : "Add Dummy Data"}
              </Button>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Sweet
              </Button>
              <ThemeToggle />
            </div>
          </div>

          <SearchSweets onSearchResults={handleSearchResults} />

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isSearchActive ? "Search Results" : "All Sweets"}
              <span className="text-muted-foreground text-base ml-2">
                ({sweetsToDisplay.length} item
                {sweetsToDisplay.length !== 1 ? "s" : ""})
              </span>
            </h2>
          </div>

          {sweetsToDisplay.length === 0 ? (
            <Card className="w-full">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {isSearchActive ? "No sweets found" : "No sweets available"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {isSearchActive
                      ? "Try adjusting your search criteria"
                      : "Get started by adding your first sweet to the inventory"}
                  </p>
                  {!isSearchActive && (
                    <div className="flex gap-2 justify-center">
                      <Button onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Sweet
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleAddDummyData}
                        disabled={createMultipleMutation.isPending}
                      >
                        <Database className="h-4 w-4 mr-2" />
                        {createMultipleMutation.isPending
                          ? "Adding..."
                          : "Add Dummy Data"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sweetsToDisplay.map((sweet) => (
                <SweetCard key={sweet.id} sweet={sweet} />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddSweetDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />

      <Toaster />
    </>
  );
}
