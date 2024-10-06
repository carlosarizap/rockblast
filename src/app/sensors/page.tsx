import SideNav from '@/app/ui/dashboard/sidenav';
import { Map } from '../ui/map';

export default function Layout() {
    return (
        <div className='flex h-screen'>
            {/* Sidenav on the left */}
            <div className='w-72 flex-none z-10 bg-white'>
                <SideNav />
            </div>

            {/* Main content */}
            <div className='bg-white rounded-2xl flex-1 overflow-auto z-0 p-4'>
                <h5>sensores</h5>
            </div>




        </div>
    );
}
