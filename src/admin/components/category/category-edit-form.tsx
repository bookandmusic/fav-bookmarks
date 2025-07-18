import { useEffect, useMemo } from 'react';

import { Icon } from '@iconify/react';
import { Button, Form, Input, Modal, Radio, Switch } from 'antd';
import { useForm } from 'antd/es/form/Form';

import { Category, CateType } from '@/admin/types/category/base';
import {
  CategoryFormFields,
  CategoryFormValue,
} from '@/admin/types/category/form';

import { CategoryCascader } from './category-cascader';
import { getCategoryPath } from './utilities';

export const CategoryEditForm = ({
  categoryList,
  initialValues,
  resetForm,
  onFinish,
}: {
  categoryList: Category[];
  initialValues?: CategoryFormValue;
  resetForm: boolean;
  onFinish?: (values: CategoryFormValue) => void;
}) => {
  const [form] = useForm();
  const [modal, contextHolder] = Modal.useModal();

  const { initValues, disableType } = useMemo(() => {
    if (initialValues) {
      const pidPath = getCategoryPath(categoryList, initialValues.pid);
      return {
        initValues: {
          ...initialValues,
          pid: pidPath,
        },
        disableType: true,
      };
    }
    return {
      disableType: false,
    };
  }, [initialValues, categoryList]);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(initValues);
  }, [form, initValues, resetForm]);

  const handleFinish = async (values: CategoryFormFields) => {
    const sanitizedValues = {
      ...values,
      // eslint-disable-next-line unicorn/no-null
      pid: values.pid?.at(-1) || null,
      // eslint-disable-next-line unicorn/no-null
      icon: values.icon || null,
    };

    await onFinish?.(sanitizedValues);
  };

  const showSaveConfirm = async () => {
    await form.validateFields();
    const name = form.getFieldValue('name') || '未命名';
    modal.confirm({
      title: '确认保存',
      icon: <Icon icon="lucide:save" width={24} color="#1677ff" />,
      content: `确定要保存分类 "${name}" 吗？`,
      onOk: () => form.submit(),
    });
  };

  return (
    <Form form={form} labelCol={{ span: 4 }} onFinish={handleFinish}>
      <Form.Item
        label="名称"
        name="name"
        rules={[{ required: true, message: '请输入名称' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="图标" name="icon">
        <Input />
      </Form.Item>
      <Form.Item label="是否公开" name="isPublic" valuePropName="checked">
        <Switch checkedChildren="开启" unCheckedChildren="关闭" />
      </Form.Item>
      <Form.Item
        label="类型"
        name="type"
        rules={[{ required: true, message: '请选择类型' }]}
      >
        <Radio.Group
          disabled={disableType}
          options={[
            { label: '书签', value: CateType.BookMark },
            { label: '项目', value: CateType.Project },
          ]}
        />
      </Form.Item>
      <Form.Item label="上级分类" name="pid">
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
  );
};
