import { FeatureNav } from '@/frontend/components/home/feature-nav';

export default async function Home() {
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <FeatureNav />
      </div>
    </>
  );
}
