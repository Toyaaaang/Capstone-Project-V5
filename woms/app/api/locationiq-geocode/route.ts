import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const api_key = process.env.LOCATIONIQ_API_KEY;
  if (!api_key) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const viewbox = "121.3500,13.4000,122.4000,14.5000";
  const url =
    `https://api.locationiq.com/v1/search` +
    `?key=${api_key}` +
    `&q=${encodeURIComponent(q)}, Quezon, Philippines` +
    `&countrycodes=ph` +
    `&viewbox=${viewbox}&bounded=1` +
    `&limit=3&format=json`;

  const resp = await fetch(url);
  const results = await resp.json();

  // Optionally filter for state=Quezon
  const filtered = Array.isArray(results)
    ? results.filter(
        (r) =>
          r.address &&
          typeof r.address.state === "string" &&
          r.address.state.toLowerCase() === "quezon"
      )
    : [];

  return NextResponse.json(filtered.length > 0 ? filtered : results);
}