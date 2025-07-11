import { Button, Tabs } from "antd";

import { CateType } from "@/types/category";

export const CategoryTabs = ({
  onTabSwitch,
  onAddCategory,
}: {
  onTabSwitch: (key: CateType) => void;
  onAddCategory?: () => void;
}) => {
  const tabList = [
    { key: CateType.BookMark, tab: "书签" },
    { key: CateType.Project, tab: "项目" },
  ];

  return (
    <Tabs
      onChange={(key) => onTabSwitch(key as CateType)}
      items={tabList.map((item) => ({ key: item.key, label: item.tab }))}
      tabBarExtraContent={
        onAddCategory && (
          <Button type="primary" onClick={onAddCategory}>
            新建
          </Button>
        )
      }
    />
  );
};
