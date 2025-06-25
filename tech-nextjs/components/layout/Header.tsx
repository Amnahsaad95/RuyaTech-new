import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Link href="/" className="text-2xl font-bold text-primary dark:text-primary-400">
            خبير
          </Link>
          <div className="hidden md:flex space-x-6 space-x-reverse">
            <Link href="/jobs" className="hover:text-primary dark:hover:text-primary-400">
              الوظائف
            </Link>
            <Link href="/experts" className="hover:text-primary dark:hover:text-primary-400">
              الخبراء
            </Link>
            <Link href="/courses" className="hover:text-primary dark:hover:text-primary-400">
              الدورات
            </Link>
            <Link href="/events" className="hover:text-primary dark:hover:text-primary-400">
              الفعاليات
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-4 py-2 rounded-md text-primary border border-primary hover:bg-primary hover:text-white dark:hover:bg-primary-400 dark:border-primary-400 dark:text-primary-400"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-md bg-primary text-white hover:bg-blue-600 dark:bg-primary-400 dark:hover:bg-primary-500"
          >
            إنشاء حساب
          </Link>
        </div>
      </div>
    </nav>
  )
}