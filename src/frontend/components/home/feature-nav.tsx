import Image from 'next/image';
import Link from 'next/link';

import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';

const homeItems = [
  {
    key: '1',
    title: '收藏夹',
    description: '同步的浏览器书签',
    cover: '/bookmark.png',
    href: '/bookmarks',
  },
  {
    key: '2',
    title: '项目集',
    description: '收藏的Github项目',
    cover: '/project.png',
    href: '/projects',
  },
];

export const FeatureNav = () => {
  return (
    <div className="w-full flex flex-wrap items-center justify-center max-w-[900px] gap-12 md:gap-64 px-4 py-6">
      {homeItems.map((item) => (
        <Link href={item.href} key={item.key}>
          <Card
            hoverable
            className="w-[260px]"
            cover={
              <Image
                width={260}
                height={260}
                alt={item.title}
                src={item.cover}
              />
            }
          >
            <Meta title={item.title} description={item.description} />
          </Card>
        </Link>
      ))}
    </div>
  );
};
