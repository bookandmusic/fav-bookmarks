import { NextRequest } from "next/server";

import { fetchMetadata } from "@/lib/fetch-utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  // todo: 从后台配置获取proxy
  const proxy = undefined;

  if (!url) {
    return Response.json({ error: "缺少网址参数" }, { status: 400 });
  }

  try {
    const result = await fetchMetadata(url, {
      proxyUrl: proxy || undefined,
      timeout: 1000,
    });

    return Response.json(result);
  } catch (e) {
    return Response.json(
      {
        icon: null,
        title: null,
        description: null,
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}
