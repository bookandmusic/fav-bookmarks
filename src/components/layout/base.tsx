export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        className="w-full h-full min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url(/bg.jpg)',
        }}
      >
        {children}
      </div>
    </>
  );
}
