export interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
  creationAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  slug: string;
  description: string;
  category: Category;
  images: string[];
  creationAt: string;
  updatedAt: string;
}

export interface ProductsParams {
  categories?: string[];
  priceRanges?: PriceRange[];
  searchQuery?: string;
  sortBy?: SortOption;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
}

export interface Filters {
  categories: string[];
  priceRanges: PriceRange[];
}

export interface PriceRange {
  min: number;
  max: number | null;
  label: string;
}

