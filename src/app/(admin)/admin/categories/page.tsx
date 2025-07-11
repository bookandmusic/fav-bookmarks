"use client";
import { Icon } from "@iconify/react";
import { Pagination } from "antd";
import { useState } from "react";

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/client/categoryClient";
import {
  BreadcrumbNav,
  CategoryEditDrawer,
  CategoryList,
  CategoryTabs,
} from "@/components/category/index";
import { FullScreenOverlay } from "@/components/loading";
import { useCategory } from "@/hooks/useCategory";
import { useNotification } from "@/hooks/useNotification";
import { Category, CategoryFormValue } from "@/types/category";

export default function Categories() {
  const { setError, setInfo, contextHolder } = useNotification();
  const {
    reload,
    setReload,
    categoryList,
    items,
    total,
    page,
    setPage,
    pageSize,
    cateTypeChange,
    handleItemClick,
    handleGoBack,
    hasBack,
  } = useCategory(setError);

  const [open, setOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const editeCategory = (item: Category) => {
    setCurrentCategory(item);
    setOpen(true);
  };

  const editeSubmit = (id: number, values: CategoryFormValue) => {
    updateCategory(id, values)
      .then(() => {
        setIsLoading(false);
        setInfo(`修改${values.name}成功`);
        setOpen(false);
        setReload(!reload);
      })
      .catch((error) => {
        setError(error);
      });
  };
  const onAddCategory = () => {
    setCurrentCategory(null);
    setOpen(true);
  };

  const addSubmit = (values: CategoryFormValue) => {
    createCategory(values)
      .then(() => {
        setIsLoading(false);
        setInfo(`创建${values.name}成功`);
        setOpen(false);
        setReload(!reload);
      })
      .catch((error) => {
        setError(error);
      });
  };
  const delCategory = (item: Category) => {
    setIsLoading(true);
    deleteCategory(item.id)
      .then(() => {
        setIsLoading(false);
        setInfo(`删除${item.name}成功`);
        setReload(!reload);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error);
      });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {contextHolder}
      {isLoading && <FullScreenOverlay />}
      <div className="flex flex-col gap-4 h-full w-full lg:w-[900px] p-6">
        <CategoryTabs
          onTabSwitch={cateTypeChange}
          onAddCategory={onAddCategory}
        ></CategoryTabs>
        <BreadcrumbNav handleGoBack={handleGoBack} hasBack={hasBack} />
        <div className="flex flex-1 overflow-y-auto border border-gray-200">
          <CategoryList
            items={items}
            onClick={handleItemClick}
            onEdit={editeCategory}
            onDelete={delCategory}
          ></CategoryList>
        </div>

        <Pagination
          pageSize={pageSize}
          current={page}
          total={total}
          showSizeChanger={false}
          onChange={setPage}
        />
      </div>
      <div className="hidden lg:flex flex-1 w-full h-full items-center justify-center">
        <div className="w-1/2 max-w-[200px]">
          <Icon
            width={200}
            height={200}
            icon="material-icon-theme:folder-core"
            className="w-full h-auto"
          />
        </div>
      </div>
      <CategoryEditDrawer
        initialValues={currentCategory}
        open={open}
        setOpen={setOpen}
        categoryList={categoryList}
        onFinish={(values) => {
          setIsLoading(true);
          if (currentCategory) {
            editeSubmit(currentCategory.id, values);
          } else {
            addSubmit(values);
          }
        }}
      />
    </div>
  );
}
