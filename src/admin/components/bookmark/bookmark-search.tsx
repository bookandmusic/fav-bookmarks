import { Collapse, CollapseProps } from 'antd';
import { Button, Form, Input, Radio } from 'antd';
import { useForm } from 'antd/es/form/Form';

import { CategoryCascader } from '@/admin/components/category/index';
import { BookmarkSearchFormValue } from '@/admin/types/bookmark/components';
import { Category } from '@/admin/types/category/base';

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

export const BookmarkSearch = ({
  categoryList,
  onFinish,
}: {
  categoryList: Category[];
  onFinish?: (values: BookmarkSearchFormValue) => void;
}) => {
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: '筛选条件',
      children: (
        <BookmarkSearchForm categoryList={categoryList} onFinish={onFinish} />
      ),
    },
  ];
  return <Collapse items={items} />;
};
