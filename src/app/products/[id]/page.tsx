import { ProductDetails } from '@/components/product-details';
import { getProductById } from '@/lib/api';
import type { Metadata } from 'next';

type Params = Promise<{
  id: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductById(Number.parseInt(resolvedParams.id));

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  // Await the params object before accessing its properties
  const resolvedParams = await params;

  const product = await getProductById(Number.parseInt(resolvedParams.id));

  return <ProductDetails product={product} />;
}
