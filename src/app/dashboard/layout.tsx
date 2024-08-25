import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout() {
    return (
        <div className='flex h-screen '>
            {/* Sidenav en la izquierda */}
            <div className='w-72 flex-none z-10 bg-white'>
                <SideNav />
            </div>

            {/* Contenido principal */}
            <div className='bg-white rounded-2xl flex-1 overflow-auto z-0 p-4'>
                <div className="h-full bg-gradient-to-br from-custom-blue to-custom-blue-light p-8 flex flex-col gap-8 rounded-2xl">
                    <div className="flex gap-8 flex-grow">
                        <div className="bg-white rounded-2xl p-8 flex-grow"></div>
                        <div className="bg-white rounded-2xl p-8 w-1/3"></div>
                    </div>
                    <div className="bg-white rounded-2xl p-8 flex-grow"></div>
                </div>
            </div>



        </div>
    );
}