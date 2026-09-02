import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/product';
import dbJson from '../../../../../.db/db.json';

function getFallbackProduct(slug: string) {
  const p = (dbJson.products || []).find((item: any) =>
    item.id === slug ||
    item.id.padStart(10, '0') === slug ||
    parseInt(item.id, 10) === parseInt(slug, 10)
  );

  if (!p) return null;

  return {
    _id: (p.id || '').toString().padStart(10, '0'),
    originalId: (p.id || '').toString().padStart(10, '0'),
    ...p
  };
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    await dbConnect();
    
    // First try to find by originalId (which is used as slug)
    let product = await Product.findOne({ originalId: slug });
    
    // If not found by originalId, try by _id
    if (!product) {
      if (/^[0-9a-fA-F]{24}$/.test(slug)) {
        product = await Product.findById(slug);
      }
    }
    
    if (!product) {
      const fallback = getFallbackProduct(slug);
      if (fallback) {
        return NextResponse.json(fallback);
      }
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.warn('MongoDB single product query failed, using static db.json fallback:', error);
    const fallback = getFallbackProduct(slug);
    if (fallback) {
      return NextResponse.json(fallback);
    }
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }
}
