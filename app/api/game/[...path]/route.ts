import { NextRequest } from "next/server";

function getApiBase() {
  return process.env.GAME_API_BASE ?? process.env.NEXT_PUBLIC_GAME_API_BASE ?? "http://localhost:8000";
}

function buildTargetUrl(req: NextRequest, path: string[]) {
  const base = getApiBase().replace(/\/+$/, "");
  const targetPath = path.join("/");
  return `${base}/${targetPath}${req.nextUrl.search}`;
}

function copyRequestHeaders(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");
  return headers;
}

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const url = buildTargetUrl(req, path);

  const init: RequestInit = {
    method: req.method,
    headers: copyRequestHeaders(req),
    redirect: "manual"
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  const upstream = await fetch(url, init);

  const resHeaders = new Headers(upstream.headers);
  // Avoid misleading caching in dev/proxy mode.
  resHeaders.delete("content-encoding");
  resHeaders.delete("content-length");

  return new Response(upstream.body, { status: upstream.status, headers: resHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;

