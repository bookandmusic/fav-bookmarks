'use client';
import { useState } from 'react';

import { Icon } from '@iconify/react';
import { Pagination } from 'antd';

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/client/category-client';
import {
  BreadcrumbNav,
  CategoryEditDrawer,
  CategoryList,
  CategoryTabs,
} from '@/components/category/index';
import { FullScreenOverlay } from '@/components/loading';
import { useCategory } from '@/hooks/use-category';
import { useNotification } from '@/hooks/use-notification';
import { asyncWrapper } from '@/lib/utilities';
import { Category, CategoryFormValue } from '@/types/category';

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
  const [currentCategory, setCurrentCategory] = useState<
    Category | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);

  const editeCategory = (item: Category) => {
    setCurrentCategory(item);
    setOpen(true);
  };

  const editeSubmit = (id: number, values: CategoryFormValue) => {
    setIsLoading(true);
    asyncWrapper(updateCategory(id, values), {
      onSuccess: () => {
        setIsLoading(false);
        setInfo(`分类：${values.name}，修改成功`);
        setOpen(false);
        setReload(!reload);
      },
      onError: setError,
      onFinally: () => setIsLoading(false),
    });
  };
  const onAddCategory = () => {
    setCurrentCategory(undefined);
    setOpen(true);
  };

  const addSubmit = (values: CategoryFormValue) => {
    setIsLoading(true);
    asyncWrapper(createCategory(values), {
      onSuccess: () => {
        setIsLoading(false);
        setInfo(`分类：${values.name}，添加成功`);
        setOpen(false);
        setReload(!reload);
      },
      onError: setError,
      onFinally: () => setIsLoading(false),
    });
  };
  const delCategory = (item: Category) => {
    setIsLoading(true);
    asyncWrapper(deleteCategory(item.id), {
      onSuccess: () => {
        setIsLoading(false);
        setInfo(`分类：${item.name}，删除成功`);
        setReload(!reload);
      },
      onError: setError,
      onFinally: () => setIsLoading(false),
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
