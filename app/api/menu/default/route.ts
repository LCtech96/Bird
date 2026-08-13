import { NextResponse } from "next/server"
import { defaultMenuCategories } from "@/lib/menu-data-default"

export async function GET() {
  return NextResponse.json(defaultMenuCategories)
}
