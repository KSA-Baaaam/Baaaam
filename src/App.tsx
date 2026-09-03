import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import About from '@/pages/About'
import Account from '@/pages/Account'
import Admin from '@/pages/Admin'
import Auth from '@/pages/Auth'
import CategoryList from '@/pages/CategoryList'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import PostDetail from '@/pages/PostDetail'
import Privacy from '@/pages/Privacy'
import SearchResults from '@/pages/SearchResults'
import SubjectHub from '@/pages/SubjectHub'
import Terms from '@/pages/Terms'

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/math" element={<SubjectHub subject="math" />} />
        <Route path="/science" element={<SubjectHub subject="science" />} />
        <Route path="/category" element={<Navigate to="/category/all" replace />} />
        <Route path="/category/earth" element={<Navigate to="/category/earth-science" replace />} />
        <Route path="/category/:categoryId" element={<CategoryList />} />
        <Route path="/post/:postId" element={<PostDetail />} />
        <Route path="/article/:postId" element={<PostDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Auth key="login" mode="login" />} />
        <Route path="/signup" element={<Auth key="signup" mode="signup" />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QueryClientProvider>
  )
}
