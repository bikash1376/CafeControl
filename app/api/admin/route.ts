// app/api/admin/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FoodItem from "@/app/models/FoodItem";


// GET → Fetch all food items and log them
export async function GET(req: Request) {
  try {
    await connectDB();

    const foodItems = await FoodItem.find();

    console.log("Food items:", foodItems); // server-side console log

    return NextResponse.json({ success: true, data: foodItems }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching food items:", error.message);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}


// POST → Create new food item
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, message: "Please provide name and price" },
        { status: 400 }
      );
    }

    const newFoodItem = await FoodItem.create(body);

    return NextResponse.json({ success: true, data: newFoodItem }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating food item:", error.message);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

// PUT → Update a food item
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const updatedItem = await FoodItem.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return NextResponse.json({ success: true, data: updatedItem }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating food item:", error.message);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

// DELETE → Delete a food item
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    await FoodItem.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Food item deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting food item:", error.message);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
