import { useEffect, useState } from 'react';

import { Drawer } from 'antd';

import { BookmarkFormValue } from '@/types/bookmark';
import { Category } from '@/types/category';

import { BookmarkForm } from './bookmark-form';

import '@ant-design/v5-patch-for-react-19';

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
