import "@ant-design/v5-patch-for-react-19";

import { Icon } from "@iconify/react";
import {
  Button,
  Cascader,
  Drawer,
  Form,
  Input,
  Radio,
  Switch,
  Tabs,
} from "antd";
import { List } from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import { useForm } from "antd/es/form/Form";
import { useEffect, useMemo } from "react";

import { CategoryFormValue, CategoryNode, CateType } from "@/types/category";
import { Category } from "@/types/category";

export const CategoryTabs = ({
  onTabSwitch,
  onAddCategory,
}: {
  onTabSwitch: (key: CateType) => void;
  onAddCategory?: () => void;
}) => {
  const tabList = [
    {
      key: CateType.BookMark,
      tab: "书签",
    },
    {
      key: CateType.Project,
      tab: "项目",
    },
  ];

  return (
    <Tabs
      onChange={(key) => onTabSwitch(key as CateType)}
      items={tabList.map((item) => ({
        key: item.key,
        label: item.tab,
      }))}
      tabBarExtraContent={
        <>
          {onAddCategory && (
            <Button type="primary" onClick={onAddCategory}>
              新建
            </Button>
          )}
        </>
      }
    />
  );
};
export const BreadcrumbNav = ({
  handleGoBack,
  hasBack,
}: {
  handleGoBack: () => void;
  hasBack: boolean;
}) => {
  if (!hasBack) {
    return (
      <div className="flex gap-2 items-center">
        <Icon icon="tabler:current-location" width={20} height={20} />
        <span>暂无上一级</span>
      </div>
    );
  }

  return (
    <div
      className="flex gap-2 items-center cursor-pointer"
      onClick={handleGoBack}
    >
      <Icon icon="carbon:return" width={20} height={20} />
      <span>返回上一级</span>
    </div>
  );
};

export const CategoryList = ({
  items,
  onClick,
  onEdit,
  onDelete,
}: {
  items: Category[];
  onClick?: (item: Category) => void;
  onEdit?: (item: Category) => void;
  onDelete?: (item: Category) => void;
}) => {
  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={items}
      className="w-full"
      renderItem={(item) => (
        <List.Item key={item.id}>
          <div className="flex items-center justify-between cursor-pointer">
            <div
              className="flex items-center gap-2"
              onClick={() => {
                onClick?.(item);
              }}
            >
              <Icon
                icon={item.icon ? item.icon : "flat-color-icons:folder"}
                width={20}
                height={20}
              />
              <span>{item.name}</span>
            </div>
            <div className="flex gap-2 items-center justify-end">
              {onEdit && (
                <span
                  onClick={() => {
                    onEdit(item);
                  }}
                  className="cursor-pointer text-blue-500"
                >
                  编辑
                </span>
              )}
              {onDelete && (
                <span
                  onClick={() => {
                    onDelete(item);
                  }}
                  className="cursor-pointer text-red-500"
                >
                  删除
                </span>
              )}
            </div>
          </div>
        </List.Item>
      )}
    />
  );
};

function buildCategoryTree(
  categories: Category[],
  parentId: number | null = null,
): CategoryNode[] {
  return categories
    .filter((item) => item.pid === parentId)
    .map((item) => ({
      value: item.id,
      label: item.name,
      children: buildCategoryTree(categories, item.id),
      ...item,
    }));
}

export function CategoryCascader({
  categoryList,
  value,
  onChange,
}: {
  categoryList: Category[];
  value?: number[];
  onChange?: (value: number[]) => void;
}) {
  const treeData = useMemo(
    () => buildCategoryTree(categoryList),
    [categoryList],
  );
  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      (option) =>
        (option.label as string)
          .toLowerCase()
          .indexOf(inputValue.toLowerCase()) > -1,
    );
  return (
    <Cascader
      value={value}
      showSearch={{ filter }}
      options={treeData}
      onChange={onChange}
      changeOnSelect
      placeholder="请选择分类"
    />
  );
}

type FieldType = {
  name: string;
  pid?: number[];
  icon?: string;
  isPublic: boolean;
  type: CateType;
};

function getCategoryPath(
  categoryId: number | null,
  categories: Category[],
): number[] {
  const path: number[] = [];

  function findCategory(id: number | null): void {
    if (id === null) return;
    const category = categories.find((item) => item.id === id);
    if (category) {
      path.unshift(category.id); // 从最底层向上添加
      findCategory(category.pid); // 递归查找父级
    }
  }
  findCategory(categoryId);
  return path;
}

export function CategoryForm({
  categoryList,
  initialValues,
  onFinish,
  open,
  setOpen,
}: {
  categoryList: Category[];
  initialValues: CategoryFormValue | null;
  onFinish?: (values: CategoryFormValue) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const [form] = useForm();

  const { initValues, disableType } = useMemo(() => {
    if (initialValues && categoryList) {
      const pidPath = getCategoryPath(initialValues.pid, categoryList);
      return {
        initValues: {
          name: initialValues.name,
          icon: initialValues.icon || undefined,
          isPublic: initialValues.isPublic || false,
          type: initialValues.type || CateType.BookMark,
          pid: pidPath,
        },
        disableType: true,
      };
    }
    return {
      initValues: {
        isPublic: false,
        type: CateType.BookMark,
      },
      disableType: false,
    };
  }, [initialValues, categoryList]);
  const handleFinish = (values: FieldType) => {
    const sanitizedValues = {
      ...values,
      pid:
        values.pid && values.pid.length > 0
          ? values.pid[values.pid.length - 1]
          : null,
      icon: values.icon ?? null,
    };
    onFinish?.(sanitizedValues);
  };
  useEffect(() => {
    if (open && initValues) {
      form.resetFields();
      form.setFieldsValue(initValues);
    }
  }, [open, form, initValues]);
  return (
    <>
      <Drawer
        closable={{ "aria-label": "Close Button" }}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={handleFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="名称"
            name="name"
            rules={[{ required: true, message: "输入分类名称" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label="图标" name="icon">
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            name="isPublic"
            label="是否公开"
            rules={[{ required: true, message: "选择是否公开" }]}
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>

          <Form.Item<FieldType>
            name="type"
            label="类型"
            rules={[{ required: true, message: "选择类型" }]}
          >
            <Radio.Group
              disabled={disableType}
              block
              options={[
                {
                  value: CateType.BookMark,
                  label: "书签",
                },
                {
                  value: CateType.Project,
                  label: "项目",
                },
              ]}
            />
          </Form.Item>
          <Form.Item<FieldType> name="pid" label="上级分类">
            <CategoryCascader categoryList={categoryList} />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
