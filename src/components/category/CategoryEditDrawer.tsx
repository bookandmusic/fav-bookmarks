import "@ant-design/v5-patch-for-react-19";

import { Drawer } from "antd";
import { useState } from "react";

import { Category } from "@/types/category";
import { CategoryFormValue } from "@/types/category";

import { CategoryEditForm } from "./CategoryEditForm";

export const CategoryEditDrawer = ({
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
}) => {
  const [resetForm, setResetForm] = useState(false);
  return (
    <Drawer
      width={600}
      closable
      onClose={() => {
        setResetForm(!resetForm);
        setOpen(false);
      }}
      open={open}
    >
      <CategoryEditForm
        categoryList={categoryList}
        initialValues={initialValues}
        onFinish={onFinish}
        resetForm={resetForm}
      />
    </Drawer>
  );
};
