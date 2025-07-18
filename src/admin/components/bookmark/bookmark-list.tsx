import { memo } from 'react';

import { Icon } from '@iconify/react';
import { Avatar, Button, List, Modal } from 'antd';

import { Bookmark } from '@/admin/types/bookmark/base';

export const BookmarkList = memo(
  ({
    bookmarkList,
    onEdit,
    onDelete,
    isDeleted,
    onRecover,
  }: {
    bookmarkList: Bookmark[];
    onEdit?: (item: Bookmark) => void;
    onDelete?: (item: Bookmark) => void;
    isDeleted?: boolean;
    onRecover?: (item: Bookmark) => void;
  }) => {
    const [modal, contextHolder] = Modal.useModal();
    const confirmDelete = (item: Bookmark) => {
      modal.confirm({
        title: '确认删除',
        icon: <Icon icon="lucide:delete" width={24} color="#ff4d4f" />,
        content: `确定要删除书签"${item.title}" 吗？`,
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
          itemLayout="horizontal"
          size="large"
          className="w-full"
          dataSource={bookmarkList}
          renderItem={(item, index) => (
            <List.Item key={index} className="flex flex-col">
              <List.Item.Meta
                className="w-full"
                avatar={
                  <Avatar
                    src={item.icon || undefined}
                    icon={!item.icon && <Icon icon="mdi:link" width={20} />}
                  />
                }
                title={
                  <a href={item.url} target="_blank">
                    {item.title}
                  </a>
                }
                description={item.description}
              />
              <div className="w-full flex gap-2 justify-start m-2">
                {!isDeleted && onEdit && (
                  <Button type="text" onClick={() => onEdit(item)}>
                    编辑
                  </Button>
                )}
                {isDeleted && onRecover && (
                  <Button type="text" onClick={() => onRecover(item)}>
                    还原
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
            </List.Item>
          )}
        />
      </>
    );
  }
);

BookmarkList.displayName = 'BookmarkList';
