'use client';
import { useMemo } from 'react';

import { Icon } from '@iconify/react';
import { Button } from 'antd';

import '@ant-design/v5-patch-for-react-19';

// 定义泛型组件类型
interface ToolBarProperties<T> {
  selectedItems: T[];
  onAddHandler: () => void;
  onEditHandler: (item: T) => void;
  onDeleteHandler: (items: T[]) => void;
  onUploadHandler: () => void;
}

export function ToolBar<T>(properties: ToolBarProperties<T>) {
  const {
    selectedItems,
    onAddHandler,
    onEditHandler,
    onDeleteHandler,
    onUploadHandler,
  } = properties;

  // 计算按钮状态
  const disableEditButton = useMemo(
    () => selectedItems.length !== 1,
    [selectedItems]
  );
  const disableDeleteButton = useMemo(
    () => selectedItems.length === 0,
    [selectedItems]
  );
  const disableAddButton = useMemo(
    () => selectedItems.length > 0,
    [selectedItems]
  );

  return (
    <div className="flex items-center justify-start gap-4">
      {/* 新建按钮 */}
      <Button
        icon={<Icon icon="mingcute:add-line" />}
        onClick={onAddHandler}
        disabled={disableAddButton}
      >
        新建目标
      </Button>

      {/* 编辑按钮 */}
      <Button
        icon={<Icon icon="material-symbols:edit-outline-rounded" />}
        onClick={() => {
          if (selectedItems.length > 0) {
            onEditHandler(selectedItems[0]);
          }
        }}
        disabled={disableEditButton}
      >
        编辑
      </Button>

      {/* 删除按钮 */}
      <Button
        icon={<Icon icon="iwwa:delete" />}
        onClick={() => onDeleteHandler([...selectedItems])}
        disabled={disableDeleteButton}
      >
        删除
      </Button>
      <Button icon={<Icon icon="ep:upload" />} onClick={onUploadHandler}>
        上传书签
      </Button>
    </div>
  );
}
