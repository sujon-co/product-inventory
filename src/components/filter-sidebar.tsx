'use client';

import { useSidebar } from '@/components/sidebar-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAllCategories } from '@/lib/api';
import { PriceRange } from '@/types';
import { ChevronLeft, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const PRICE_RANGES: PriceRange[] = [
  { min: 0, max: 50, label: 'Under $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 200, label: '$100 - $200' },
  { min: 200, max: 500, label: '$200 - $500' },
  { min: 500, max: 1000, label: '$500 - $1000' },
  { min: 1000, max: null, label: 'Over $1000' },
];

export function FilterSidebar() {
  const {
    isOpen,
    toggleSidebar,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
  } = useSidebar();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setFilters({
        ...filters,
        categories: [...filters.categories, category],
      });
    } else {
      setFilters({
        ...filters,
        categories: filters.categories.filter((c) => c !== category),
      });
    }
  };

  const handlePriceRangeChange = (priceRange: PriceRange, checked: boolean) => {
    if (checked) {
      setFilters({
        ...filters,
        priceRanges: [...filters.priceRanges, priceRange],
      });
    } else {
      setFilters({
        ...filters,
        priceRanges: filters.priceRanges.filter(
          (p) => p.label !== priceRange.label
        ),
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRanges: [],
    });
    setSearchQuery('');
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRanges.length > 0 ||
    searchQuery.length > 0;

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-0'
      } transition-all duration-300 ease-in-out overflow-hidden border-r border-border bg-card h-screen sticky top-0 flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="font-semibold text-lg">Filters</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1.5 h-6 w-6"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {hasActiveFilters && (
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">Active Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {category}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handleCategoryChange(category, false)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {category}</span>
                  </Button>
                </Badge>
              ))}
              {filters.priceRanges.map((range) => (
                <Badge
                  key={range.label}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {range.label}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handlePriceRangeChange(range, false)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {range.label}</span>
                  </Button>
                </Badge>
              ))}
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="p-4 border-b">
          <h3 className="font-medium mb-3">Categories</h3>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-5 bg-muted rounded animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(
                        category,
                        checked === true ? true : false
                      )
                    }
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="space-y-2">
            {PRICE_RANGES.map((range) => (
              <div key={range.label} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${range.label}`}
                  checked={filters.priceRanges.some(
                    (p) => p.label === range.label
                  )}
                  onCheckedChange={(checked) =>
                    handlePriceRangeChange(
                      range,
                      checked === true ? true : false
                    )
                  }
                />
                <Label
                  htmlFor={`price-${range.label}`}
                  className="text-sm cursor-pointer"
                >
                  {range.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
