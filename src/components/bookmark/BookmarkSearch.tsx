import { Collapse, CollapseProps } from "antd";

import { BookmarkSearchFormValue } from "@/types/bookmark";
import { Category } from "@/types/category";

import { BookmarkSearchForm } from "./BookmarkSearchForm";

export const BookmarkSearch = ({
  categoryList,
  onFinish,
}: {
  categoryList: Category[];
  onFinish?: (values: BookmarkSearchFormValue) => void;
}) => {
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "筛选条件",
      children: (
        <BookmarkSearchForm categoryList={categoryList} onFinish={onFinish} />
      ),
    },
  ];
  return <Collapse items={items} />;
};
