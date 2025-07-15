import { Icon } from '@iconify/react';
import { Button, Dropdown, MenuProps } from 'antd';

export function BookmarkToolbar({
  onAllClick,
  onSearchClick,
  onAddClick,
  onUploadHandler,
  onTrashHandler,
}: {
  onAllClick: () => void;
  onSearchClick: () => void;
  onAddClick: () => void;
  onUploadHandler: () => void;
  onTrashHandler: () => void;
}) {
  const handleMenuClick: MenuProps['onClick'] = (item: { key: string }) => {
    handleMap[item.key]();
  };
  const handleMap: Record<string, () => void> = {
    '1': onAddClick,
    '2': onUploadHandler,
    '3': onTrashHandler,
  };

  const items: MenuProps['items'] = [
    {
      label: '添加书签',
      key: '1',
      icon: <Icon icon="proicons:add" width={20} height={20} />,
    },
    {
      label: '导入书签',
      key: '2',
      icon: <Icon icon="proicons:arrow-import" width={20} height={20} />,
    },
    {
      label: '回收站',
      key: '3',
      icon: <Icon icon="proicons:delete" width={20} height={20} />,
    },
  ];

  const menuProperties = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <Button type="text" onClick={onAllClick}>
          全部
        </Button>
        <Button
          type="text"
          onClick={onSearchClick}
          icon={
            <Icon
              icon="mynaui:search-square"
              width={20}
              height={20}
              style={{ verticalAlign: 'middle' }}
            />
          }
          style={{ display: 'flex', alignItems: 'center' }}
        >
          搜索
        </Button>
      </div>
      <div>
        <Dropdown.Button
          menu={menuProperties}
          placement="bottomRight"
          icon={<Icon icon="mdi:unfold-more-horizontal" />}
        >
          操作
        </Dropdown.Button>
      </div>
    </div>
  );
}
