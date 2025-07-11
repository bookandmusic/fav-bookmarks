import "@ant-design/v5-patch-for-react-19";

import { Drawer } from "antd";
import { useState } from "react";

import { BookmarkFormValue } from "@/types/bookmark";
import { Category } from "@/types/category";

import { BookmarkForm } from "./BookmarkForm";

export const BookmarkEditDrawer = ({
  categoryList,
  initialValues,
  onFinish,
  open,
  setOpen,
  setError,
}: {
  categoryList: Category[];
  initialValues: BookmarkFormValue | null;
  onFinish?: (values: BookmarkFormValue) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  setError: (e: Error | null) => void;
}) => {
  const [resetForm, setResetForm] = useState(false);
  return (
    <Drawer
      closable={{ "aria-label": "Close Button" }}
      onClose={() => {
        setOpen(false);
        setResetForm(!resetForm);
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
