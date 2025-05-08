/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@/config';
import type { Product, ProductsParams } from '@/types';


export async function getProducts({
  categories = [],
  priceRanges = [],
  searchQuery = '',
  sortBy = 'title',
  sortDirection = 'asc',
  page = 1,
  limit = 10,
}: ProductsParams): Promise<{ data: Product[]; total: number }> {
  const params = new URLSearchParams();

  // Add pagination parameters
  params.append('limit', limit.toString());
  params.append('offset', ((page - 1) * limit).toString());

  // Add title search
  if (searchQuery) {
    params.append('title', searchQuery);
  }

  if (categories.length > 0) {
    // Note: The API only supports filtering by one category at a time
    // We'll use the first selected category
    const categoryResponse = await fetch(`${config.API_URL}/categories`);
    if (!categoryResponse.ok) {
      throw new Error('Failed to fetch categories');
    }
    const allCategories = await categoryResponse.json();
    const categoryObj = allCategories.find(
      (cat: any) => cat.name === categories[0]
    );
    if (categoryObj) {
      params.append('categoryId', categoryObj.id.toString());
    }
  }

  if (priceRanges.length > 0) {
    // Find the minimum and maximum values across all selected price ranges
    let minPrice = Number.MAX_SAFE_INTEGER;
    let maxPrice = 0;

    priceRanges.forEach((range) => {
      if (range.min < minPrice) minPrice = range.min;
      if (range.max !== null && range.max > maxPrice) maxPrice = range.max;
      if (range.max === null) maxPrice = 10000; // Use a high value for "$500+" range
    });

    params.append('price_min', minPrice.toString());
    params.append('price_max', maxPrice.toString());
  }

  // Fetch products with filters
  const url = `${config.API_URL}/products?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const products: Product[] = await response.json();

  // Get total count for pagination
  // to get an approximate count
  const countResponse = await fetch(`${config.API_URL}/products`);
  let totalCount = 0;

  if (countResponse.ok) {
    const allProducts = await countResponse.json();

    // Apply the same filters to get an accurate count
    let filteredProducts = allProducts;

    // Filter by search if needed (in case the API search is not exact)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product: Product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Filter by category if needed
    if (categories.length > 0) {
      filteredProducts = filteredProducts.filter((product: Product) =>
        categories.includes(product.category.name)
      );
    }

    totalCount = filteredProducts.length;
  } else {
    // Fallback: use the length of the returned products * total pages as an estimate
    totalCount = products.length * 10; // Assuming there are more pages
  }

  // Sort products (the API doesn't support sorting)
  products.sort((a, b) => {
    let valueA, valueB;

    if (sortBy === 'price') {
      valueA = a.price;
      valueB = b.price;
    } else if (sortBy === 'category') {
      valueA = a.category.name;
      valueB = b.category.name;
    } else {
      valueA = a.title;
      valueB = b.title;
    }

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return sortDirection === 'asc'
      ? (valueA as number) - (valueB as number)
      : (valueB as number) - (valueA as number);
  });

  return {
    data: products,
    total: totalCount,
  };
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${config.API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch product with ID ${id}`);
  }

  return response.json();
}

export async function getAllCategories(): Promise<string[]> {
  const response = await fetch(`${config.API_URL}/categories`);

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const categories = await response.json();
   
  return categories.map((category: any) => category.name);
}
