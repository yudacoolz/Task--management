import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    // component: RouteComponent,
    beforeLoad: () => {
        const user = localStorage.getItem("access_token");
        if (!user) throw redirect({ to: "/login" });
        throw redirect({ to: "/auth/task", replace: true });
    },
})

// function RouteComponent() {
//     return (
//         <div>
//             <h1 className="text-2xl mb-4 font-bold">Dashboard</h1>
//             <p>Selamat datang di halaman utama!</p>
//         </div>
//     )
// }
