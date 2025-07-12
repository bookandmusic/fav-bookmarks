import Image from 'next/image';
import Link from 'next/link';

import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';

import { homeItems } from '@/lib/menu';

export default async function Home() {
  return (
    <>
      <div className="flex flex-wrap justify-center gap-6 px-4 py-6">
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
    </>
  );
}
