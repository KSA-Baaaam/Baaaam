import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Route, Routes } from 'react-router-dom'

import About from '@/pages/About'
import Account from '@/pages/Account'
import Admin from '@/pages/Admin'
import Auth from '@/pages/Auth'
import CategoryList from '@/pages/CategoryList'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import PostDetail from '@/pages/PostDetail'
import SearchResults from '@/pages/SearchResults'
import SubjectHub from '@/pages/SubjectHub'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QueryClientProvider>
  )
}
