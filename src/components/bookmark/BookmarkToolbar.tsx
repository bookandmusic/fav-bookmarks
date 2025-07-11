import { Icon } from "@iconify/react";
import { Button } from "antd";

export function BookmarkToolbar({
  onAllClick,
  onSearchClick,
  onAddClick,
}: {
  onAllClick: () => void;
  onSearchClick: () => void;
  onAddClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white shadow rounded-md">
      <div className="flex gap-2">
        <Button type="text" onClick={onAllClick}>
          全部
        </Button>
        <Button
          type="text"
          onClick={onSearchClick}
          icon={<Icon icon="mynaui:search-square" width={16} height={16} />}
        >
          搜索
        </Button>
      </div>
      <div>
        <Button type="primary" onClick={onAddClick}>
          添加
        </Button>
      </div>
    </div>
  );
}
