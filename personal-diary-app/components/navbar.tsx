import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Navbar = () => {
  const { data: session, status } = useSession();
  console.log(`current session: ${session}`)
  const isLoggedIn = status === 'authenticated';
  console.log(`current status: ${status}`)
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };  

  return (
    <nav className="bg-gradient-to-r from-pink-500 to-purple-600 shadow-md">
      <div className="container mx-auto px-6 py-3 text-white md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            My Diary
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:mt-0 md:ml-4">
          {isLoggedIn && (
            <Link href="/entries" className="px-4 py-2 text-m font-semibold md:mt-0 md:mr-4 hover:underline">
              Diary Entries
            </Link>
          )}

          <div>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-purple-600 bg-white rounded-full hover:bg-gray-100 transition-colors">
                Logout
              </button>
            ) : (
              <Link href="/login" className="px-4 py-2 text-sm font-semibold text-purple-600 bg-white rounded-full hover:bg-gray-100 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
