import { parseBookmarkHTML } from '@/lib/bookmark/parse-bookmark-file';
import { saveBookmarkNodes } from '@/lib/bookmark/save-bookmark';
import { logger } from '@/lib/logger';
import { bookmarkService } from '@/services/bookmark';
import { userService } from '@/services/user';

function unauthorizedResponse() {
  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="WebDAV Upload"' },
  });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorizedResponse();
  }

  const { path } = await context.params;
  const filePath = path.join('/');
  const base64Credentials = authHeader.slice('Basic '.length);
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [username, password] = credentials.split(':');

  if (!username || !password) {
    return unauthorizedResponse();
  }

  // 查询数据库用户
  const user = await userService.findUserByUniqueKey(username);
  if (!user || !user.password) {
    return unauthorizedResponse();
  }

  // 验证密码
  const passwordMatch = await userService.validatePassword(
    {
      password: user.password,
    },
    password
  );
  if (!passwordMatch) {
    return unauthorizedResponse();
  }

  // 密码验证成功，处理文件上传
  try {
    const fileBuffer = Buffer.from(await request.arrayBuffer());
    // 处理文件内容
    const fileContent = fileBuffer.toString('utf8');
    logger.info(`用户 ${username} 上传文件:${filePath}`);

    // 解析书签 HTML 为节点结构
    const nodes = parseBookmarkHTML(fileContent);

    // 保存到数据库（递归插入分类和书签）
    await bookmarkService.deleteAll();
    await saveBookmarkNodes(nodes, user.id);
    return new Response(
      JSON.stringify({
        message: '文件上传成功',
        length: fileBuffer.length,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    logger.error(`上传文件${filePath}失败`, error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  // 简单示例：返回 404，表示文件不存在
  return new Response('Not Found', { status: 404 });
}
