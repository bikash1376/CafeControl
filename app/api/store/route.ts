// app/api/store/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FoodItem from "@/app/models/FoodItem";
// import FoodItem from "@/models/FoodItem";

// GET → Fetch all food items
export async function GET() {
  try {
    await connectDB();
    const foodItems = await FoodItem.find({});
    return NextResponse.json({ success: true, foodItems }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching food items:", error.message);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
