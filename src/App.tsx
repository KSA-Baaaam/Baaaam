import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense, useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Home from '@/pages/Home'

const About = lazy(() => import('@/pages/About'))
const Account = lazy(() => import('@/pages/Account'))
const Admin = lazy(() => import('@/pages/Admin'))
const Auth = lazy(() => import('@/pages/Auth'))
const CategoryList = lazy(() => import('@/pages/CategoryList'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const PostDetail = lazy(() => import('@/pages/PostDetail'))
const Privacy = lazy(() => import('@/pages/Privacy'))
const SearchResults = lazy(() => import('@/pages/SearchResults'))
const SubjectHub = lazy(() => import('@/pages/SubjectHub'))
const Terms = lazy(() => import('@/pages/Terms'))
const Team = lazy(() => import('@/pages/Team'))
const WritePost = lazy(() => import('@/pages/WritePost'))

const queryClient = new QueryClient()

function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollToTop />
      <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-white px-5 text-sm font-semibold text-ink-muted">화면을 불러오는 중입니다.</main>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/math" element={<SubjectHub subject="math" />} />
          <Route path="/science" element={<SubjectHub subject="science" />} />
          <Route path="/category" element={<Navigate to="/category/all" replace />} />
          <Route path="/category/earth" element={<Navigate to="/category/earth-science" replace />} />
          <Route path="/category/:categoryId" element={<CategoryList />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/article/:postId" element={<PostDetail />} />
          <Route path="/posts/:slug" element={<PostDetail />} />
          <Route path="/:postRef" element={<PostDetail />} />
          <Route path="/write" element={<WritePost />} />
          <Route path="/write/:postId" element={<WritePost />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/team" element={<Team />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Auth key="login" mode="login" />} />
          <Route path="/signup" element={<Auth key="signup" mode="signup" />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </QueryClientProvider>
  )
}
