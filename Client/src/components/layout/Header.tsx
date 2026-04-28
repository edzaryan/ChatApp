import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import ChatIcon from "../icons/ChatIcon";


function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    }

    return (
        <div className='flex justify-center bg-gray-600 sticky top-0 w-full'>
            <div className='w-[1000px] grid items-center grid-cols-[200px_1fr_200px] py-3'>
                <div className='h-[32px]'>
                    <ChatIcon size={40} />
                </div>
                <div className='grid grid-cols-[1fr_auto]'>
                    <input 
                        className='w-full bg-white rounded-l-md py-1 px-2' 
                        placeholder='Search'
                    />
                    <div className='grid justify-center items-center cursor-pointer py-1 px-4 rounded-r-md bg-gray-200 hover:bg-gray-300'>
                        <Search size={20} />
                    </div>
                </div>
                <div className='flex justify-end'>
                    <button
                        className='bg-indigo-500 hover:bg-blue-600 py-1 px-3 cursor-pointer rounded-md text-white'
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header;