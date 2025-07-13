/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';

import { IncomingForm } from 'formidable';
import { Readable, Writable } from 'node:stream';

import { authenticateRequest } from '@/lib/auth/auth-middleware';
import { parseBookmarkHTML } from '@/lib/bookmark/parse-bookmark-file';
import { saveBookmarkNodes } from '@/lib/bookmark/save-bookmark';
import { createErrorResponse } from '@/lib/http-helper';
import { logger } from '@/lib/logger';

export const config = {
  api: {
    bodyParser: false,
  },
};

// 将 Next.js 的 Request 转换为 Node.js Readable 流
class RequestWrapper extends Readable {
  headers: Record<string, string>;
  private reader: ReadableStreamDefaultReader<Uint8Array>;

  constructor(request: Request) {
    super();
    this.headers = {};
    for (const [k, v] of request.headers.entries()) {
      this.headers[k.toLowerCase()] = v;
    }
    if (!request.body) throw new Error('Request body is missing');
    this.reader = request.body.getReader();
  }

  async _read() {
    try {
      const { done, value } = await this.reader.read();
      if (done) {
        // eslint-disable-next-line unicorn/no-null
        this.push(null);
      } else {
        this.push(Buffer.from(value));
      }
    } catch (error) {
      logger.error('读取 request 流错误:', error);
      this.destroy(error as Error);
    }
  }
}

// 封装 formidable 处理为 Promise
function parseForm(stream: Readable): Promise<{ fields: any; files: any }> {
  const form = new IncomingForm({
    maxFileSize: 50 * 1024 * 1024,
    allowEmptyFiles: false,
    multiples: false,
    fileWriteStreamHandler() {
      const chunks: Buffer[] = [];
      const writable = new Writable({
        write(chunk, _encoding, callback) {
          chunks.push(Buffer.from(chunk));
          callback();
        },
        final(callback) {
          logger.info('✅ 文件流写入完成');
          callback();
        },
      });
      (writable as any).bufferChunks = chunks;
      return writable;
    },
  });

  return new Promise((resolve, reject) => {
    form.parse(stream as any, (error, fields, files) => {
      if (error) {
        reject(error);
      } else {
        resolve({ fields, files });
      }
    });
  });
}

// 上传 API 接口
export async function POST(request: Request): Promise<Response> {
  try {
    const userId = await authenticateRequest();
    if (!userId) {
      return createErrorResponse('用户未登录', 401);
    }

    const stream = new RequestWrapper(request);
    const { files } = await parseForm(stream);

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const chunks = (file as any)?._writeStream?.bufferChunks;

    if (!chunks || !Array.isArray(chunks)) {
      return createErrorResponse('未找到上传文件', 400);
    }

    const buffer = Buffer.concat(chunks);
    const html = buffer.toString('utf8');

    // 解析书签 HTML 为节点结构
    const nodes = parseBookmarkHTML(html);

    // 保存到数据库（递归插入分类和书签）
    await saveBookmarkNodes(nodes, userId);

    return NextResponse.json({ message: '上传成功', count: nodes.length });
  } catch (error) {
    logger.error('上传失败:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : '上传失败',
      500
    );
  }
}
