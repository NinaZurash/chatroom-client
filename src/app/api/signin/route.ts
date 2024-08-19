import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL; // Add your backend API URL here

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (req.method === "POST") {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ message: "Sign-in failed" }, { status: 500 });
    }
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
}
