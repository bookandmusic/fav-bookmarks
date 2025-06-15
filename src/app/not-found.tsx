import "@ant-design/v5-patch-for-react-19";

import { Button, Result } from "antd";

import { BaseLayout } from "@/components/layout/base";

export default function NotFound() {
  return (
    <BaseLayout>
      <Result
        status="404"
        title={<span className="text-center text-white text-4xl">404</span>}
        subTitle={
          <span className="text-center text-white text-lg">
            哎呀！找不到页面了！
          </span>
        }
        extra={
          <Button
            type="primary"
            href="/"
            style={{
              color: "white",
            }}
          >
            返回首页
          </Button>
        }
      />
    </BaseLayout>
  );
}
