import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("http://impulse.yadro.msk.ru");
  const data = await res.json();
  return NextResponse.json(data);
}
