import { UserCircle, ChevronLeft, ChevronRight } from 'lucide-react';


const Header = () => {
    return (
        <div className='fixed top-0 bg-white px-8 py-4 w-full flex justify-between items-center border-b-2 border-gray-200'>
            <ChevronLeft size={32} color='black' />
            <UserCircle size={32} color='black' />
        </div>
    )
}

export default Header