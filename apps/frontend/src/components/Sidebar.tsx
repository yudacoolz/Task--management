import { Link, Navigate, useNavigate } from '@tanstack/react-router'
import { Home, Bell, Settings, LogOut, ListTodo } from 'lucide-react'

const Sidebar = () => {
    const navigate = useNavigate()


    const handleLogout = () => {
        const accessToken = localStorage.getItem('access_token')
        if (accessToken) {
            localStorage.removeItem('access_token')
        }
        navigate({ to: '/login' })
    }

    return (
        <div className='min-h-screen bg-white w-1/6 text-gray-800'>
            <ul className='flex flex-col'>
                <li className='p-2 hover:bg-gray-200 flex gap-2'>
                    <Home />
                    <Link to='/'>Home</Link>
                </li>
                <li className='p-2 hover:bg-gray-200 flex gap-2'>
                    <ListTodo />
                    <Link to='/auth/task'>Tasks</Link>
                </li>
                <li className='p-2 hover:bg-gray-200 flex gap-2'>
                    <Bell />
                    <Link to='/auth/notification'>Notifications</Link>
                </li>
                <li className='p-2 hover:bg-gray-200 flex gap-2 text-red-400'>
                    <LogOut />
                    <button onClick={handleLogout}>Logout</button>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar