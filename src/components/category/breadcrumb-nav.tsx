import { Icon } from '@iconify/react';

export const BreadcrumbNav = ({
  handleGoBack,
  hasBack,
}: {
  handleGoBack: () => void;
  hasBack: boolean;
}) => (
  <div
    className="flex gap-2 items-center cursor-pointer"
    onClick={hasBack ? handleGoBack : undefined}
  >
    <Icon
      icon={hasBack ? 'carbon:return' : 'tabler:current-location'}
      width={20}
      height={20}
      style={{ verticalAlign: 'middle' }}
    />
    <span>{hasBack ? '返回上一级' : '暂无上一级'}</span>
  </div>
);
