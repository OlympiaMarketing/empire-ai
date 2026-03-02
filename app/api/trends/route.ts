import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const source = searchParams.get("source")
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
  const offset = parseInt(searchParams.get("offset") || "0")

  let query = supabase
    .from("trends")
    .select("*")
    .order("trend_date", { ascending: false })
    .order("search_volume", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1)

  if (category) {
    query = query.eq("category", category)
  }

  if (source) {
    query = query.eq("source", source)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ trends: data, count })
}
