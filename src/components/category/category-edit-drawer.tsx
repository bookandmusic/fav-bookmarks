import { useEffect, useState } from 'react';

import { Drawer } from 'antd';

import { Category } from '@/types/category';
import { CategoryFormValue } from '@/types/category';

import { CategoryEditForm } from './category-edit-form';

import '@ant-design/v5-patch-for-react-19';

export const CategoryEditDrawer = ({
  categoryList,
  initialValues,
  onFinish,
  open,
  setOpen,
}: {
  categoryList: Category[];
  initialValues?: CategoryFormValue;
  onFinish?: (values: CategoryFormValue) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const [resetForm, setResetForm] = useState(false);
  useEffect(() => {
    if (open == false) {
      setResetForm((previous) => !previous);
    }
  }, [open]);
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
