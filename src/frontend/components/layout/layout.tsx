import { User } from '@prisma/client';

import { Footer } from './footer';
import { Header } from './header';

export const RootLayout = ({
  user,
  children,
}: {
  user?: User;
  children: React.ReactNode;
}) => {
  return (
    <div
      className="flex flex-col w-full h-full min-h-screen"
      style={{ backgroundImage: 'url("/bg.jpg")' }}
    >
      <Header user={user} />
      <div className="flex flex-1">{children}</div>
      <Footer />
    </div>
  );
};
