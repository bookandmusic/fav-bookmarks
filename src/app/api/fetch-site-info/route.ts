import { NextRequest } from 'next/server';

import { fetchMetadata } from '@/lib/bookmark/fetch-metadata';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  // todo: 从后台配置获取proxy
  const proxy = undefined;

  if (!url) {
    return Response.json({ error: '缺少网址参数' }, { status: 400 });
  }

  try {
    const result = await fetchMetadata(url, {
      proxyUrl: proxy || undefined,
      timeout: 1000,
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
