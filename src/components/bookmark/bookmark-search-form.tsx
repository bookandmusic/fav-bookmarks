import { Button, Form, Input, Radio } from 'antd';
import { useForm } from 'antd/es/form/Form';

import { CategoryCascader } from '@/components/category/index';
import { BookmarkSearchFormValue } from '@/types/bookmark';
import { Category } from '@/types/category';

type FieldType = {
  keyword?: string;
  categoryId?: number[];
  isPublic?: boolean;
};

export const BookmarkSearchForm = ({
  categoryList,
  onFinish,
}: {
  categoryList: Category[];
  onFinish?: (values: BookmarkSearchFormValue) => void;
}) => {
  const [form] = useForm();
  const handleFinish = (values: FieldType) => {
    const sanitizedValues = {
      categoryId: values.categoryId?.at(-1),
      keyword: values.keyword,
      isPublic: values.isPublic,
    };
    onFinish?.(sanitizedValues);
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      <Form.Item<FieldType> name="keyword" label="标题">
        <Input placeholder="输入关键字" />
      </Form.Item>
      <Form.Item<FieldType> name="categoryId" label="分类">
        <CategoryCascader categoryList={categoryList} />
      </Form.Item>
      <Form.Item<FieldType> name="isPublic" label="公开">
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item>
        <div className="flex justify-center gap-8">
          <Button type="primary" htmlType="submit">
            筛选
          </Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </div>
      </Form.Item>
    </Form>
  );
};
