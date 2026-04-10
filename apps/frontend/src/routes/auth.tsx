// src/routes/_authenticated.tsx
import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'

export const Route = createFileRoute('/auth')({
  beforeLoad: async ({ context, location }) => {
    const user = localStorage.getItem("access_token");
    if (!user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-indigo-950 w-full flex">
      <Sidebar />

      <div className="flex flex-col w-5/6 pl-6 md:pl-[2%]">
        <Header />
        <main className="flex-1 w-full px-6 md:px-[5%] pt-10 md:pt-24 bg-white">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}