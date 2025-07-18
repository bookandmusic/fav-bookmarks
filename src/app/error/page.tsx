// src/app/error/page.tsx

import { Button, Result } from 'antd';

import { BaseLayout } from '@/frontend/components/layout/base';

export default function ErrorPage() {
  return (
    <BaseLayout>
      <Result
        status="500"
        title={<span className="text-center text-white text-4xl">500</span>}
        subTitle={
          <span className="text-center text-white text-lg">
            出了一点小问题，请稍后再试或点击下方按钮回到首页。
          </span>
        }
        extra={
          <Button
            type="primary"
            href="/"
            style={{
              color: 'white',
            }}
          >
            返回首页
          </Button>
        }
      />
    </BaseLayout>
  );
}
