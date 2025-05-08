'use client';

import { useSidebar, type SortOption } from '@/components/sidebar-provider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getProducts } from '@/lib/api';
import type { Product } from '@/types';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductTable() {
  const router = useRouter();
  const {
    filters,
    searchQuery,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
  } = useSidebar();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const { data, total } = await getProducts({
          categories: filters.categories,
          priceRanges: filters.priceRanges,
          searchQuery,
          sortBy,
          sortDirection,
          page: currentPage,
          limit: productsPerPage,
        });
        setProducts(data);
        setTotalProducts(total);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [
    filters,
    searchQuery,
    sortBy,
    sortDirection,
    currentPage,
    productsPerPage,
  ]);

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSort = (column: SortOption) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (column: SortOption) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const getStockStatus = (product: Product) => {
    // This is a mock function - in a real app, you'd have actual stock data
    const stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];
    const randomIndex = product.id % 3;
    return stockStatuses[randomIndex];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Low Stock':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'Out of Stock':
        return <Circle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getPriorityIcon = (price: number) => {
    if (price > 500) return <ArrowUp className="h-4 w-4 text-red-500" />;
    if (price > 100) return <ArrowRight className="h-4 w-4 text-amber-500" />;
    return <ArrowDown className="h-4 w-4 text-green-500" />;
  };

  const getPriorityText = (price: number) => {
    if (price > 500) return 'High';
    if (price > 100) return 'Medium';
    return 'Low';
  };

  const handleProductsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newProductsPerPage = parseInt(e.target.value, 10);
    setCurrentPage(1); // Reset to first page when changing items per page
    setProductsPerPage(newProductsPerPage);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Inventory</h1>
      </div>

      <div className="rounded-md border border-border bg-card text-card-foreground">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th
                  className="h-10 px-4 text-left align-middle font-medium cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Title {renderSortIcon('title')}
                  </div>
                </th>
                <th
                  className="h-10 px-4 text-left align-middle font-medium cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category {renderSortIcon('category')}
                  </div>
                </th>
                <th className="h-10 px-4 text-left align-middle font-medium">
                  Status
                </th>
                <th
                  className="h-10 px-4 text-left align-middle font-medium cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Priority {renderSortIcon('price')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                Array.from({ length: productsPerPage }).map((_, index) => (
                  <tr
                    key={index}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle ">
                      <Skeleton className="h-10 w-10 mr-14" />
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="p-4 align-middle">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No products found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr
                      key={product.id}
                      className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs font-medium">
                            {product.title.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="font-medium">PROD-{product.id}</div>
                        </div>
                      </td>
                      <td className="p-4 align-middle max-w-[300px] truncate">
                        <div className="flex flex-col">
                          <span className="font-medium truncate">
                            {product.title}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {product.description.substring(0, 60)}...
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(stockStatus)}
                          <span>{stockStatus}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(product.price)}
                          <span>
                            ${product.price.toFixed(2)} (
                            {getPriorityText(product.price)})
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            {totalProducts} rows
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Rows per page</span>
              <select
                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                value={productsPerPage}
                onChange={(e) => handleProductsPerPageChange(e)}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || loading}
              >
                <span className="sr-only">First page</span>
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                <span className="sr-only">Previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                <span className="sr-only">Next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || loading}
              >
                <span className="sr-only">Last page</span>
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
