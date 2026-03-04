import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const user = await axios.post(`${process.env.API_URL}/register`, {
      email,
      password,
      name,
    });

    return NextResponse.json(user.data, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorData = axios.isAxiosError(error) ? error.response?.data : null;
    console.error("Signup error:", errorData || errorMessage);

    return NextResponse.json(
      {
        message: "Signup failed",
        error: errorData || errorMessage,
      },
      { status: 400 },
    );
  }
}
