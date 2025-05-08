# Product Inventory

A modern product inventory management application built with Next.js and TypeScript.

![Product Inventory Screenshot](https://postimg.cc/bS9pjhqK)

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sujon-co/product-inventory.git

cd product-inventory
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

## Features

- **Product List**: View all products with sorting, filtering, and pagination
- **Product Details**: Detailed view of each product with images and specifications
- **Search**: Search products by title
- **Filtering**: Filter products by category and price range

## Folder Structure

```text
product-inventory/
├── app/                  # Next.js app router
│   ├── products/         # Product routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── filter-sidebar.tsx # Filtering sidebar
│   ├── product-table.tsx  # Product table component
│   ├── product-details.tsx # Product details component
│   └── ui/               # UI components
├── lib/                  # Utility functions
│   ├── api.ts            # API functions
│   └── utils.ts          # Utility functions
└── types/                # TypeScript types
└── config/               # Configuration files
```
