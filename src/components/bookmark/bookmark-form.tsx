import { useEffect, useMemo, useState } from 'react';

import { Icon } from '@iconify/react';
import { Button, Form, Input, Modal, Switch } from 'antd';
import { useForm } from 'antd/es/form/Form';

import { fetchSiteinfo } from '@/client/fetch-utility';
import { CategoryCascader, getCategoryPath } from '@/components/category/index';
import { BookmarkFormFields, BookmarkFormValue } from '@/types/bookmark';
import { Category } from '@/types/category';

export function BookmarkForm({
  categoryList,
  initialValues,
  resetForm,
  onFinish,
  setError,
}: {
  categoryList: Category[];
  initialValues: BookmarkFormValue | undefined;
  resetForm: boolean;
  onFinish?: (values: BookmarkFormValue) => void;
  setError: (error: Error | undefined) => void;
}) {
  const [form] = useForm();
  const [isLoadingIcon, setIsLoadingIcon] = useState(false);
  const initValues = useMemo(() => {
    if (initialValues && categoryList) {
      const pidPath = getCategoryPath(categoryList, initialValues.categoryId);
      return {
        title: initialValues.title,
        url: initialValues.url,
        description: initialValues.description,
        icon: initialValues.icon,
        categoryId: pidPath,
        isPublic: initialValues.isPublic,
      };
    }
    return;
  }, [initialValues, categoryList]);

  useEffect(() => {
    form.resetFields();
    if (initValues) {
      form.setFieldsValue(initValues);
    }
  }, [form, initValues, resetForm]);

  const handleFinish = async ({
    categoryId,
    icon,
    description,
    ...rest
  }: BookmarkFormFields) => {
    const sanitizedValues = {
      ...rest,
      categoryId: categoryId?.[categoryId.length - 1],
      // eslint-disable-next-line unicorn/no-null
      icon: icon ?? null,
      // eslint-disable-next-line unicorn/no-null
      description: description ?? null,
    };
    await onFinish?.(sanitizedValues);
  };

  const [modal, contextHolder] = Modal.useModal();

  const showSaveConfirm = async () => {
    await form.validateFields();
    const title = form.getFieldValue('title') || '未命名';
    modal.confirm({
      title: '确认保存',
      icon: <Icon icon="lucide:save" width={24} color="#1677ff" />,
      content: `确定要保存书签 "${title}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        form.submit();
      },
    });
  };

  const urlFieldValue = Form.useWatch('url', form);
  const handleFetchFavicon = async () => {
    const url = form.getFieldValue('url');
    if (!url) return;

    setIsLoadingIcon(true);
    try {
      const { icon, title, description } = await fetchSiteinfo(url);
      form.setFieldsValue({ icon, title, description });
    } catch (error_) {
      const error =
        error_ instanceof Error ? error_ : (new Error('获取图标失败') as Error);
      setError(error);
    } finally {
      setIsLoadingIcon(false);
    }
  };

  return (
    <>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 4 }}
        onFinish={handleFinish}
      >
        {/* Form items remain unchanged */}
        <Form.Item
          label="网址"
          name="url"
          rules={[
            { required: true, message: '请输入网址' },
            { type: 'url', message: '请输入有效的网址' },
          ]}
        >
          <Input
            addonAfter={
              <Button
                size="small"
                type="text"
                loading={isLoadingIcon}
                disabled={!urlFieldValue || isLoadingIcon}
                onClick={handleFetchFavicon}
                icon={<Icon icon="streamline-plump:loading-circle" />}
                style={{ verticalAlign: 'middle' }}
              />
            }
          />
        </Form.Item>

        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="可手动填写标题" disabled={isLoadingIcon} />
        </Form.Item>

        <Form.Item
          label="图标"
          name="icon"
          rules={[{ type: 'url', message: '请输入有效的图标链接' }]}
        >
          <Input placeholder="可手动填写图标地址" disabled={isLoadingIcon} />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
          rules={[{ max: 200, message: '描述不能超过200个字符' }]}
        >
          <Input placeholder="可手动填写描述信息" disabled={isLoadingIcon} />
        </Form.Item>

        <Form.Item label="是否公开" name="isPublic" valuePropName="checked">
          <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>

        <Form.Item
          label="分类"
          name="categoryId"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <CategoryCascader categoryList={categoryList} />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-center gap-8">
            {contextHolder}
            <Button type="primary" onClick={showSaveConfirm}>
              保存
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
}
