import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Tabs } from 'antd';

import { CateType } from '@/admin/types/category/base';

export const CategoryTabs = ({
  onTabSwitch,
  onAddCategory,
}: {
  onTabSwitch: (key: CateType) => void;
  onAddCategory?: () => void;
}) => {
  const tabList = [
    { key: CateType.BookMark, tab: '书签' },
    { key: CateType.Project, tab: '项目' },
  ];

  return (
    <Tabs
      onChange={(key) => onTabSwitch(key as CateType)}
      items={tabList.map((item) => ({ key: item.key, label: item.tab }))}
      tabBarExtraContent={
        onAddCategory && (
          <Button type="text" onClick={onAddCategory}>
            <Icon icon="formkit:add" className="w-5 h-5" />
            新建
          </Button>
        )
      }
    />
  );
};
