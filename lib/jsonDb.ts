import fs from "fs";
import path from "path";

export interface JSONProduct {
  _id: any;
  name: string;
  slug: string;
  description: string;
  category: string;
  images: string[];
  price: number;
  originalPrice: number;
  discountPercent?: number;
  sizes: string[];
  colors: { name: string; hex: string; _id?: any }[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  createdAt: any;
  __v?: number;
}

const JSON_FILE_PATH = path.join(process.cwd(), "ananyanewshop.products.json");

function normalizeProduct(prod: any): JSONProduct {
  const normalized = { ...prod };
  
  // Handle MongoDB Shell Export formats
  if (normalized._id && normalized._id.$oid) {
    normalized._id = normalized._id.$oid;
  }
  
  if (normalized.createdAt && normalized.createdAt.$date) {
    normalized.createdAt = new Date(normalized.createdAt.$date);
  } else if (normalized.createdAt) {
    normalized.createdAt = new Date(normalized.createdAt);
  } else {
    normalized.createdAt = new Date();
  }

  if (normalized.colors) {
    normalized.colors = normalized.colors.map((c: any) => ({
      ...c,
      _id: c._id && c._id.$oid ? c._id.$oid : c._id
    }));
  }

  return normalized as JSONProduct;
}

export async function getProductsFromJSON() {
  try {
    if (!fs.existsSync(JSON_FILE_PATH)) {
      console.warn("JSON backup file not found at:", JSON_FILE_PATH);
      return [];
    }
    const data = fs.readFileSync(JSON_FILE_PATH, "utf-8");
    const rawProducts = JSON.parse(data);
    return Array.isArray(rawProducts) ? rawProducts.map(normalizeProduct) : [];
  } catch (error) {
    console.error("Error reading products from JSON:", error);
    return [];
  }
}

export async function queryProductsJSON(filters: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  slug?: string;
  sort?: string;
}) {
  let products = await getProductsFromJSON();

  if (filters.slug) {
    return products.find(p => p.slug === filters.slug) || null;
  }

  if (filters.category && filters.category !== "All") {
    const catRegex = new RegExp(`^${filters.category}$`, "i");
    products = products.filter(p => catRegex.test(p.category));
  }

  if (filters.search) {
    const searchStr = filters.search.toLowerCase().trim();
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchStr) || 
      p.description.toLowerCase().includes(searchStr) || 
      p.category.toLowerCase().includes(searchStr)
    );
  }

  if (filters.minPrice !== undefined) {
    products = products.filter(p => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    products = products.filter(p => p.price <= filters.maxPrice!);
  }

  if (filters.isFeatured !== undefined) {
    products = products.filter(p => p.isFeatured === filters.isFeatured);
  }

  if (filters.isNewArrival !== undefined) {
    products = products.filter(p => p.isNewArrival === filters.isNewArrival);
  }

  // Sorting
  if (filters.sort === "price-asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "price-desc") {
    products.sort((a, b) => b.price - a.price);
  } else if (filters.sort === "rating") {
    products.sort((a, b) => b.rating - a.rating);
  } else {
    // Default: Sort by createdAt desc
    products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  return products;
}

export async function getCategoriesFromJSON() {
  const products = await getProductsFromJSON();
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  
  const priorityCategories = [
    { name: "Lehenga", static: "/Red Lehenga Image.png" },
    { name: "Saree", static: "/Purple Saree Image.png" },
    { name: "Kurti", static: "/Pink Kurti Image.png" },
    { name: "Suit", static: "/Pista Green Suit Image.png" },
    { name: "Frock", static: "/Peach Frock Image.png" },
    { name: "Co-ord Set", static: "/Red Co-ord Set Image.png" }
  ];

  const results = priorityCategories.map(cat => {
    const product = products.find(p => p.category === cat.name);
    return {
      name: cat.name,
      img: product?.images?.[0] || cat.static
    };
  });

  const otherCats = categories.filter(cat => !priorityCategories.some(pc => pc.name === cat));
  const otherResults = otherCats.map(cat => {
    const product = products.find(p => p.category === cat);
    return {
      name: cat,
      img: product?.images?.[0] || ""
    };
  });

  return [...results, ...otherResults].filter(c => c.name);
}
