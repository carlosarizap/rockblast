'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface NavLinksProps {
  role?: string; // Accept role as a prop
}

const links = [
  { name: 'Inicio', href: 'dashboard' },
<<<<<<< HEAD
  { name: 'Sensores', href: 'sensors' },
  { name: 'Carga de Datos', href: 'uploads' },
  { name: 'Pozos', href: 'nodes' },
];

=======
  { name: 'Pozos', href: 'nodes' },
  { name: 'Canales', href: 'channels' },
];

const adminLinks = [
  { name: 'Carga de Datos', href: 'uploads' },
  { name: 'Cuentas', href: 'accounts' },
];

>>>>>>> ab8a859c561150266ef579243a71d6784f584035
const NavLinks: React.FC<NavLinksProps> = ({ role }) => {
  const pathname = usePathname();

  return (
    <div className="overflow-auto">
      {links.map((link) => (
        <Link
          key={link.name}
          href={'/' + link.href}
          className={clsx(
            'my-2 flex h-[48px] grow items-center justify-center rounded-md p-3 text-sm text-gray-700 transition-colors hover:bg-custom-blue hover:text-white md:flex-none md:justify-start md:p-2 md:px-3',
            {
              'bg-custom-blue text-white font-semibold':
                pathname === '/' + link.href ||
                (pathname === '' && link.href === ''),
            }
          )}
        >
          <p className="hidden md:block">{link.name}</p>
        </Link>
      ))}

<<<<<<< HEAD
      {/* Conditionally render the "Cuentas" link only for Admins */}
      {role === 'Admin' && (
        <Link
          key="Cuentas"
          href="/accounts"
          className={clsx(
            'my-2 flex h-[48px] grow items-center justify-center rounded-md p-3 text-sm text-gray-700 transition-colors hover:bg-custom-blue hover:text-white md:flex-none md:justify-start md:p-2 md:px-3',
            {
              'bg-custom-blue text-white font-semibold':
                pathname === '/accounts',
            }
          )}
        >
          <p className="hidden md:block">Cuentas</p>
        </Link>
      )}
=======
      {/* Conditionally render the "Carga de Datos" and "Cuentas" links only for Admins */}
      {role === 'Admin' &&
        adminLinks.map((link) => (
          <Link
            key={link.name}
            href={'/' + link.href}
            className={clsx(
              'my-2 flex h-[48px] grow items-center justify-center rounded-md p-3 text-sm text-gray-700 transition-colors hover:bg-custom-blue hover:text-white md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-custom-blue text-white font-semibold':
                  pathname === '/' + link.href,
              }
            )}
          >
            <p className="hidden md:block">{link.name}</p>
          </Link>
        ))}
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
    </div>
  );
};

export default NavLinks;
