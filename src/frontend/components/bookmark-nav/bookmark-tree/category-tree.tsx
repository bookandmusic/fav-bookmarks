'use client';
import React, { useState } from 'react';

import { Icon } from '@iconify/react';
import { Menu } from 'antd';
import { ItemType } from 'antd/es/menu/interface';

import { Category } from '@/admin/types/category/base';

import { ContentHeight } from '../../const';

interface CategoryTreeProperties {
  categories: Category[];
  selectedId: number | undefined;
  onSelect: (id?: number) => void;
}

const CategoryTree: React.FC<CategoryTreeProperties> = ({
  categories,
  selectedId,
  onSelect,
}) => {
  const [openKeys, setOpenKeys] = useState<number[]>([]);

  const toggleOpen = (id: number) => {
    setOpenKeys((previous) =>
      previous.includes(id)
        ? previous.filter((k) => k !== id)
        : [...previous, id]
    );
  };

  const hasChildren = (id: number) => categories.some((c) => c.pid === id);

  const renderFlatMenuItems = (
    pid: number | undefined = undefined,
    level = 0
  ): ItemType[] => {
    const items = categories
      .filter((c) => c.pid === pid)
      .flatMap((c) => {
        const isOpen = openKeys.includes(c.id);
        const children =
          hasChildren(c.id) && isOpen
            ? renderFlatMenuItems(c.id, level + 1)
            : [];

        const indentStyle = {
          paddingLeft: `${level * 16}px`,
        };

        return [
          {
            key: c.id.toString(),
            icon: <Icon icon={c.icon || 'solar:folder-linear'}></Icon>,
            label: (
              <div
                style={indentStyle}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                {/* 标题点击区域 */}
                <span
                  className="flex-1"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(c.id);
                  }}
                >
                  {c.name}
                </span>

                {/* 折叠图标 */}
                {hasChildren(c.id) && (
                  <span
                    className="inline-block w-4 text-center"
                    aria-hidden="true"
                    onClick={(event) => {
                      event.stopPropagation(); // 防止冒泡触发上面的 onClick
                      toggleOpen(c.id);
                    }}
                  >
                    <Icon
                      icon={
                        isOpen
                          ? 'iconamoon:arrow-down-2'
                          : 'iconamoon:arrow-right-2'
                      }
                      className="text-xs"
                    />
                  </span>
                )}
              </div>
            ),
          },
          ...children,
        ];
      });

    // 只有根节点调用时插入全部分类
    if (level === 0 && pid === undefined) {
      return [
        {
          key: 'all',
          icon: <Icon icon="solar:folder-linear" className="mr-1" />,
          label: (
            <div
              style={{ paddingLeft: 0 }}
              className="flex items-center cursor-pointer select-none"
              onClick={(event) => {
                event.stopPropagation();
                onSelect();
              }}
            >
              <span>全部</span>
            </div>
          ),
        },
        ...items,
      ];
    }

    return items;
  };

  return (
    <div
      className="w-[220px] flex flex-col border-r border-gray-200 bg-white"
      style={{ height: ContentHeight }}
    >
      <div
        style={{
          flexGrow: 1,
          overflowY: 'scroll',
          paddingRight: 8,
        }}
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        <Menu
          mode="inline"
          selectedKeys={selectedId === undefined ? [] : [selectedId.toString()]}
          items={renderFlatMenuItems()}
          style={{ border: 'none' }}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default CategoryTree;
