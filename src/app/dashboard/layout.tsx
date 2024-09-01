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
                <div className="h-full bg-gradient-to-br from-custom-blue to-custom-blue-light p-4 flex flex-col gap-4 rounded-2xl">
                    <div className="flex gap-4 flex-grow">
                        <div className="gap-4 flex-grow flex flex-col">
                            {/* Map div with slightly more height */}
                            <div className="rounded-2xl flex-[1.5] w-full">
                                <Map />
                            </div>
                            {/* "Hello" div with slightly less height */}
                            <div className="rounded-2xl flex-[1] bg-white"></div>
                        </div>
                        <div className="bg-white rounded-2xl p-8 w-1/3"></div>
                    </div>
                </div>
            </div>




        </div>
    );
}
