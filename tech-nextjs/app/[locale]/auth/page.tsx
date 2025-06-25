import Header from '@/components/layout/Header'

import HeroCarousel from '@/components/home/HeroCarousel'
import AdSection from '@/components/home/AdSection'
import MembersSection from '@/components/home/MembersSection'
import PostsSection from '@/components/home/PostsSection'


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      
      <main className="flex-grow">
       <HeroCarousel />
        <AdSection />
        <MembersSection />
        <PostsSection />
      </main>
      
    </div>
  )
}