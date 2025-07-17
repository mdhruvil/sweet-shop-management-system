import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchSweets, useSweets } from "@/hooks/use-sweet-api";
import type { Sweet } from "@/schema/sweet";
import { type SearchCriteria, searchCriteriaSchema } from "@/schema/sweet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SearchSweetsProps {
  onSearchResults: (results: Sweet[] | null) => void;
}

export function SearchSweets({ onSearchResults }: SearchSweetsProps) {
  const { data: allSweets } = useSweets();

  // Calculate price range from existing sweets
  const priceRange = useMemo(() => {
    if (!allSweets || allSweets.length === 0) {
      return { min: 0, max: 1000 };
    }

    const prices = allSweets.map((sweet) => sweet.price);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));

    // Ensure we have a reasonable range
    return {
      min: Math.max(0, min),
      max: Math.max(min + 10, max),
    };
  }, [allSweets]);

  // Get unique categories from all sweets
  const categories = useMemo(() => {
    if (!allSweets || allSweets.length === 0) {
      return [];
    }

    const uniqueCategories = Array.from(
      new Set(allSweets.map((sweet) => sweet.category)),
    ).sort();

    return uniqueCategories;
  }, [allSweets]);

  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([priceRange.min, priceRange.max]);

  // Update price range when sweets data changes
  useEffect(() => {
    setSelectedPriceRange([priceRange.min, priceRange.max]);
  }, [priceRange.min, priceRange.max]);

  const form = useForm<Omit<SearchCriteria, "minPrice" | "maxPrice">>({
    resolver: zodResolver(
      searchCriteriaSchema.omit({ minPrice: true, maxPrice: true }),
    ),
    defaultValues: {
      name: "",
      category: "",
    },
  });

  const searchMutation = useSearchSweets();

  const onSubmit = async (
    data: Omit<SearchCriteria, "minPrice" | "maxPrice">,
  ) => {
    const searchData: SearchCriteria = {
      ...data,
      minPrice: selectedPriceRange[0],
      maxPrice: selectedPriceRange[1],
    };

    const filteredData = Object.fromEntries(
      Object.entries(searchData).filter(([key, value]) => {
        if (typeof value === "string") {
          return value.trim() !== "";
        }
        // Always include price range if it's not the full range
        if (key === "minPrice" || key === "maxPrice") {
          return (
            selectedPriceRange[0] !== priceRange.min ||
            selectedPriceRange[1] !== priceRange.max
          );
        }
        return value !== undefined && value !== null;
      }),
    ) as SearchCriteria;

    if (Object.keys(filteredData).length === 0) {
      onSearchResults(null); // This will show all sweets
      toast.success("Showing all sweets");
      return;
    }

    try {
      const results = await searchMutation.mutateAsync(filteredData);
      onSearchResults(results);
      toast.success(`Found ${results.length} sweet(s)`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Search failed");
    }
  };

  const handleClearSearch = () => {
    form.reset();
    setSelectedPriceRange([priceRange.min, priceRange.max]);
    onSearchResults(null);
  };

  const watchedValues = form.watch();
  const hasSearchCriteria =
    Object.values(watchedValues).some((value) => {
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      return value !== undefined && value !== null;
    }) ||
    selectedPriceRange[0] !== priceRange.min ||
    selectedPriceRange[1] !== priceRange.max;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Search by name..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value || "")}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="flex-1">
                <FormLabel className="block mb-4">
                  Price Range ({formatPrice(selectedPriceRange[0])} -{" "}
                  {formatPrice(selectedPriceRange[1])})
                </FormLabel>
                <DualRangeSlider
                  min={priceRange.min}
                  max={priceRange.max}
                  step={1}
                  value={selectedPriceRange}
                  onValueChange={setSelectedPriceRange}
                  formatLabel={formatPrice}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={searchMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  {searchMutation.isPending ? "Searching..." : "Search"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearSearch}
                  disabled={!hasSearchCriteria}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
