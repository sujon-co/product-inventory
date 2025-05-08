import { ProductDetails } from '@/components/product-details';
import { getProductById } from '@/lib/api';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductById(Number.parseInt(params.id));

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(Number.parseInt(params.id));

  return <ProductDetails product={product} />;
}
