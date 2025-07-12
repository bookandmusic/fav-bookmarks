import { Icon } from '@iconify/react';
import { Button, List, Modal } from 'antd';

import { Category } from '@/types/category';

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
  const [modal, contextHolder] = Modal.useModal();

  const confirmDelete = (item: Category) => {
    modal.confirm({
      title: '确认删除',
      icon: <Icon icon="lucide:delete" width={24} color="#ff4d4f" />,
      content: `确定要删除分类 "${item.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => onDelete?.(item),
    });
  };

  return (
    <>
      {contextHolder}
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
                onClick={() => onClick?.(item)}
              >
                <Icon
                  icon={item.icon || 'flat-color-icons:folder'}
                  width={20}
                  height={20}
                />
                <span>{item.name}</span>
              </div>
              <div className="flex gap-2">
                {onEdit && (
                  <Button type="link" onClick={() => onEdit(item)}>
                    编辑
                  </Button>
                )}
                {onDelete && (
                  <Button
                    type="text"
                    danger
                    onClick={() => confirmDelete(item)}
                  >
                    删除
                  </Button>
                )}
              </div>
            </div>
          </List.Item>
        )}
      />
    </>
  );
};
