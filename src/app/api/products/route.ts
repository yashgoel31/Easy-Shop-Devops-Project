import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/product';
import { requireAuth } from '@/lib/auth/utils';

import dbJson from '../../../../.db/db.json';

function getFallbackProducts(searchParams: URLSearchParams) {
  let list = (dbJson.products || []).map((p: any) => ({
    _id: (p.id || '').toString().padStart(10, '0'),
    originalId: (p.id || '').toString().padStart(10, '0'),
    ...p
  }));

  const searchVal = searchParams.get('search') || searchParams.get('q');
  if (searchVal && searchVal.trim()) {
    const s = searchVal.trim().toLowerCase();
    list = list.filter((p: any) =>
      p.title?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s)
    );
  }

  const shopCat = searchParams.get('shop_category');
  if (shopCat && shopCat !== 'Select Shop' && shopCat !== 'Select%20Shop' && shopCat.trim()) {
    list = list.filter((p: any) => p.shop_category === shopCat);
  }

  const categoriesParam = searchParams.get('categories');
  if (categoriesParam && categoriesParam.trim()) {
    const cats = categoriesParam.split(',').filter(Boolean);
    if (cats.length > 0) {
      list = list.filter((p: any) =>
        cats.some((c: string) => p.categories?.includes(c))
      );
    }
  }

  const minPriceParam = searchParams.get('minPrice');
  if (minPriceParam && !isNaN(parseFloat(minPriceParam))) {
    const min = parseFloat(minPriceParam);
    list = list.filter((p: any) => p.price >= min);
  }

  const maxPriceParam = searchParams.get('maxPrice');
  if (maxPriceParam && !isNaN(parseFloat(maxPriceParam))) {
    const max = parseFloat(maxPriceParam);
    list = list.filter((p: any) => p.price <= max);
  }

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const total = list.length;
  const skip = (page - 1) * limit;

  const products = list.slice(skip, skip + limit);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    await dbConnect();
    
    const query: any = {};
    
    // Search by title or description
    const searchVal = searchParams.get('search') || searchParams.get('q');
    if (searchVal && searchVal.trim()) {
      const searchRegex = new RegExp(searchVal.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }
    
    // Filter by shop category
    const shopCat = searchParams.get('shop_category');
    if (shopCat && shopCat !== 'Select Shop' && shopCat !== 'Select%20Shop' && shopCat.trim()) {
      query.shop_category = shopCat;
    }
    
    // Filter by categories
    const categoriesParam = searchParams.get('categories');
    if (categoriesParam && categoriesParam.trim()) {
      const categories = categoriesParam.split(',').filter(Boolean);
      if (categories.length > 0) {
        query.categories = { $in: categories };
      }
    }

    // Filter by price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if ((minPrice && !isNaN(parseFloat(minPrice))) || (maxPrice && !isNaN(parseFloat(maxPrice)))) {
      query.price = {};
      if (minPrice && !isNaN(parseFloat(minPrice))) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice && !isNaN(parseFloat(maxPrice))) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Sorting
    let sort: any = { createdAt: -1 };
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      const [field, order] = sortParam.split(':');
      if (field) {
        sort = { [field]: order === 'desc' ? -1 : 1 };
      }
    }

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    if (total === 0 && !searchParams.has('search') && !searchParams.has('categories') && !searchParams.has('minPrice')) {
      // If DB is empty, use fallback products
      return NextResponse.json(getFallbackProducts(searchParams));
    }

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.warn('MongoDB query failed, using static db.json fallback:', error);
    return NextResponse.json(getFallbackProducts(searchParams));
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const product = await Product.create(body);

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}
