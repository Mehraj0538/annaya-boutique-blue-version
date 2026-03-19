import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import HomePageClient from "@/app/HomePageClient";

export const revalidate = 3600;

export default async function HomePage() {
  await connectDB();

  const [lehRes, frockRes, newArrivalsRes] = await Promise.all([
    Product.find({ category: { $regex: /^Lehenga$/i } }).sort({ rating: -1 }).limit(4).lean(),
    Product.find({ category: { $regex: /^Frock$/i } }).sort({ rating: -1 }).limit(4).lean(),
    Product.find({ isNewArrival: true }).limit(8).lean(),
  ]);

  const combined = [...lehRes, ...frockRes];
  const bestSellersData = combined.slice(0, 8);

  // Serialize Mongoose documents properly
  const bestSellers = JSON.parse(JSON.stringify(bestSellersData));
  const newArrivals = JSON.parse(JSON.stringify(newArrivalsRes));

  return <HomePageClient bestSellers={bestSellers} newArrivals={newArrivals} />;
}
