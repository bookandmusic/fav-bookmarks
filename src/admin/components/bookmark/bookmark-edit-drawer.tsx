import { useEffect, useState } from 'react';

import { Drawer } from 'antd';

import { BookmarkFormValue } from '@/admin/types/bookmark/form';
import { Category } from '@/admin/types/category/base';

import { BookmarkForm } from './bookmark-form';

export const BookmarkEditDrawer = ({
  categoryList,
  initialValues,
  onFinish,
  open,
  setOpen,
  setError,
}: {
  categoryList: Category[];
  initialValues: BookmarkFormValue | undefined;
  onFinish?: (values: BookmarkFormValue) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  setError: (error: Error | undefined) => void;
}) => {
  const [resetForm, setResetForm] = useState(false);
  useEffect(() => {
    if (open == false) {
      setResetForm((previous) => !previous);
    }
  }, [open]);
  return (
    <Drawer
      closable={{ 'aria-label': 'Close Button' }}
      onClose={() => {
        setOpen(false);
        setResetForm((previous) => !previous);
      }}
      open={open}
      width={600}
    >
      <BookmarkForm
        resetForm={resetForm}
        categoryList={categoryList}
        initialValues={initialValues}
        onFinish={onFinish}
        setError={setError}
      />
    </Drawer>
  );
};
