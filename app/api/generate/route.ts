import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, steps } = await req.json();

    // Call the Fooocus API
    const response = await fetch("https://fooocus.one/api/flux-generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
      },
      body: JSON.stringify({ prompt, steps }),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
