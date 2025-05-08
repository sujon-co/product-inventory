'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/types';
import { ArrowLeft, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-background">
            <Image
              src={product.images[currentImage] || '/placeholder.svg'}
              alt={product.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                  currentImage === index
                    ? 'ring-2 ring-primary'
                    : 'hover:ring-2 hover:ring-primary/50'
                }`}
                onClick={() => setCurrentImage(index)}
              >
                <Image
                  src={image || '/placeholder.svg'}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="mt-2 flex items-center">
              <Badge variant="outline" className="mr-2">
                {product.category.name}
              </Badge>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  (4.0)
                </span>
              </div>
            </div>
          </div>

          <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-medium mb-2">Product Details</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">ID</span>
                <span>{product.id}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>{product.category.name}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Inventory</span>
                <span>In Stock</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
