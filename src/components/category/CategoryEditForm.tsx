import { Icon } from "@iconify/react";
import { Button, Form, Input, Modal, Radio, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useMemo, useState } from "react";

import {
  CategoryFormFields,
  CategoryFormValue,
  CateType,
} from "@/types/category";
import { Category } from "@/types/category";

import { CategoryCascader } from "./CategoryCascader";
import { getCategoryPath } from "./utils";

export const CategoryEditForm = ({
  categoryList,
  initialValues,
  resetForm,
  onFinish,
}: {
  categoryList: Category[];
  initialValues: CategoryFormValue | null;
  resetForm: boolean;
  onFinish?: (values: CategoryFormValue) => void;
}) => {
  const [form] = useForm();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  const { initValues, disableType } = useMemo(() => {
    if (initialValues) {
      const pidPath = getCategoryPath(initialValues.pid, categoryList);
      return {
        initValues: {
          ...initialValues,
          pid: pidPath,
        },
        disableType: true,
      };
    }
    return {
      initValues: null,
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
      pid: values.pid?.at(-1) ?? null,
      icon: values.icon ?? null,
    };
    try {
      await onFinish?.(sanitizedValues);
    } finally {
      setButtonDisabled(false);
    }
  };

  const showSaveConfirm = async () => {
    try {
      await form.validateFields();
      const name = form.getFieldValue("name") || "未命名";
      setButtonDisabled(true);
      modal.confirm({
        title: "确认保存",
        icon: <Icon icon="lucide:save" width={20} color="#1677ff" />,
        content: `确定要保存分类 "${name}" 吗？`,
        onOk: () => form.submit(),
        onCancel: () => setButtonDisabled(false),
      });
    } catch {
      setButtonDisabled(false);
    }
  };

  return (
    <Form form={form} labelCol={{ span: 4 }} onFinish={handleFinish}>
      <Form.Item
        label="名称"
        name="name"
        rules={[{ required: true, message: "请输入名称" }]}
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
        rules={[{ required: true, message: "请选择类型" }]}
      >
        <Radio.Group
          disabled={disableType}
          options={[
            { label: "书签", value: CateType.BookMark },
            { label: "项目", value: CateType.Project },
          ]}
        />
      </Form.Item>
      <Form.Item label="上级分类" name="pid">
        <CategoryCascader categoryList={categoryList} />
      </Form.Item>
      <Form.Item>
        <div className="flex justify-center gap-8">
          {contextHolder}
          <Button
            type="primary"
            disabled={buttonDisabled}
            onClick={showSaveConfirm}
          >
            保存
          </Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </div>
      </Form.Item>
    </Form>
  );
};
