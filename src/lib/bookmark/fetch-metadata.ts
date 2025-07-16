import axios from 'axios';
import * as chardet from 'chardet';
import { load } from 'cheerio';
import * as iconv from 'iconv-lite';

export interface MetadataResult {
  icon: string | undefined;
  title: string | undefined;
  description: string | undefined;
}

export interface FetchOptions {
  timeout?: number; // 超时时间
  proxyUrl?: string; // 可选代理地址
}

export async function fetchMetadata(
  url: string,
  options: FetchOptions = {}
): Promise<MetadataResult> {
  const { timeout = 3000, proxyUrl } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const targetUrl = proxyUrl
    ? `${proxyUrl}?url=${encodeURIComponent(url)}`
    : url;

  try {
    const response = await axios.get(targetUrl, {
      signal: controller.signal,
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'BookmarkFetcher/1.0',
      },
    });

    clearTimeout(timeoutId);

    const buffer = Buffer.from(response.data);

    // 优先从meta标签提取字符集
    const utf8Html = iconv.decode(buffer, 'utf8');
    const $ = load(utf8Html);

    let charset = $('meta[charset]').attr('charset');
    if (!charset) {
      const contentTypeMeta = $('meta[http-equiv="Content-Type"]').attr(
        'content'
      );
      if (contentTypeMeta) {
        const charsetMatch = contentTypeMeta.match(/charset=(.+)/i);
        if (charsetMatch) {
          charset = charsetMatch[1];
        }
      }
    }

    // 使用真实字符集重新解码
    const finalCharset =
      charset?.toLowerCase() || chardet.detect(buffer) || 'utf8';
    const decodedHtml = iconv.decode(buffer, finalCharset);
    const $$ = load(decodedHtml);

    // 解析 favicon
    let iconHref =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href');

    if (!iconHref) {
      iconHref = '/favicon.ico';
    }

    const baseUrl = url.endsWith('/') ? url : new URL(url).origin;
    const iconUrl = new URL(iconHref, baseUrl).href;

    // 验证 icon 是否真实存在
    let isValidIcon = false;
    try {
      const iconResponse = await axios.head(iconUrl, {
        signal: controller.signal,
      });
      isValidIcon = iconResponse.status >= 200 && iconResponse.status < 300;
    } catch {
      isValidIcon = false;
    }

    const finalIconUrl = isValidIcon ? iconUrl : undefined;

    // 解析 title 使用真实字符集解析
    const title = $$('title').text().trim() || undefined;

    // 解析 description
    const description =
      $$('meta[name="description"]').attr('content')?.trim() ||
      $$('meta[property="og:description"]').attr('content')?.trim() ||
      undefined;

    return {
      icon: finalIconUrl,
      title,
      description,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw new Error(`无法解析网站元数据: ${url}, 错误信息: ${error}`);
  }
}
