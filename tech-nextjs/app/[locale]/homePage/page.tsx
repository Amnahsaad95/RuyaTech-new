import AdSection from '@/components/home/AdSection';
import MembersSection from '@/components/home/MembersSection';
import PostsSection from '@/components/home/PostsSection';

export default async function Home() {
  const { users, posts, ads, setting } = await fetchData();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow">
        <AdSection data={ads} />
        <MembersSection data={users} />
        <PostsSection data={posts} />
      </main>
    </div>
  );
}

async function fetchData() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/all', {
      next: { revalidate: 60 } // لجعلها static مع إمكانية التحديث كل 60 ثانية
    });

    if (!response.ok) {
      throw new Error('Failed to fetch home data');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error("Home API did not return success");
  }
}
