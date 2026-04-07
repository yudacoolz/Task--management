import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'


export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="min-h-screen bg-indigo-950 text-white w-full flex ">
            <Sidebar />
            {/* Wrapper untuk mengatur padding agar rapi di semua halaman */}
            <div className='w-full flex flex-col'>
                <Header />
                <main className="flex-1 w-full max-w-4xl mx-auto px-6 md:px-[15%] lg:px-[25%] py-10 md:py-16">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    )
}
