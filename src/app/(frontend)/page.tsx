import Image from 'next/image';
import Link from 'next/link';

import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';

import { homeItems } from '@/lib/menu';

export default async function Home() {
  return (
    <>
      <div className='w-full h-full flex flex-col justify-center items-center'>
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
      </div>

    </>
  );
}
