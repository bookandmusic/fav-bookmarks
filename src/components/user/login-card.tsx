'use client';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { Icon } from '@iconify/react';
import { Button, Card, Flex, Form, FormInstance, Input } from 'antd';

import { FullScreenOverlay } from '@/components/loading';

import '@ant-design/v5-patch-for-react-19';

interface SubmitButtonProperties {
  form: FormInstance;
  onClick?: () => void;
}

export const SubmitButton: FC<PropsWithChildren<SubmitButtonProperties>> = ({
  form,
  children,
  onClick,
}) => {
  const [submittable, setSubmittable] = useState<boolean>(false);

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button
      type="primary"
      htmlType="button"
      disabled={!submittable}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export function LoginCard({ error: initialError }: { error?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (initialError) {
      setError('第三方登录失败，请稍后再试');
    }
  }, [router, initialError]);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError('');
    await signIn('github', { callbackUrl: '/' });
  };
  const handleGiteeLogin = async () => {
    setIsLoading(true);
    setError('');
    await signIn('gitee', { callbackUrl: '/' });
  };
  // form
  const [form] = Form.useForm();
  const onReset = () => {
    setError('');
    form.resetFields();
  };
  const handleEmailLogin = async () => {
    setError('');
    setIsLoading(true);
    const values = form.getFieldsValue();
    try {
      const response = await signIn('credentials', {
        ...values,
        redirect: false,
      });

      if (response?.error) {
        setError(response.error);
        setIsLoading(false);
      } else {
        router.push('/');
      }
    } catch {
      setError('登录失败');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        style={{ width: 300 }}
        actions={[
          <Button
            key={'gitee'}
            type="text"
            onClick={handleGiteeLogin}
            className="w-full h-full"
          >
            <Icon
              icon={'simple-icons:gitee'}
              style={{ verticalAlign: 'middle' }}
            ></Icon>
          </Button>,
          <Button
            key={'github'}
            type="text"
            onClick={handleGitHubLogin}
            className="w-full h-full"
          >
            <Icon
              icon={'simple-icons:github'}
              style={{ verticalAlign: 'middle' }}
            ></Icon>
          </Button>,
        ]}
        title={'登录'}
      >
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {isLoading && <FullScreenOverlay />}

        <Form form={form} style={{ maxWidth: 600 }}>
          <Form.Item name={'name'} rules={[{ required: true }]}>
            <Input
              prefix={
                <Icon
                  icon={'mdi:account-outline'}
                  style={{ verticalAlign: 'middle' }}
                />
              }
              placeholder="输入用户名"
            />
          </Form.Item>
          <Form.Item name={'password'} rules={[{ required: true }]}>
            <Input
              prefix={
                <Icon
                  icon={'mdi:lock-outline'}
                  style={{ verticalAlign: 'middle' }}
                />
              }
              type="password"
              placeholder="输入密码"
            />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-around" align="center">
              <SubmitButton form={form} onClick={handleEmailLogin}>
                提交
              </SubmitButton>
              <Button htmlType="button" onClick={onReset}>
                重置
              </Button>
            </Flex>
          </Form.Item>
          <Form.Item noStyle>
            <Flex justify="flex-end" align="flex-end">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  忘记密码？
                </a>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  注册账号
                </a>
              </div>
            </Flex>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
