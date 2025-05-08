'use client';

import { FilterSidebar } from '@/components/filter-sidebar';
import { Filters } from '@/types';
import type * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  sortBy: SortOption;
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;
  sortDirection: SortDirection;
  setSortDirection: React.Dispatch<React.SetStateAction<SortDirection>>;
}

export type SortOption = 'title' | 'price' | 'category';
export type SortDirection = 'asc' | 'desc';

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRanges: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Check if we're on mobile and close sidebar by default
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) {
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      }
    };

    // Initial check
    handleResize();

    // Add event listener only on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        filters,
        setFilters,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
      }}
    >
      <div className="flex min-h-screen">
        <FilterSidebar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
