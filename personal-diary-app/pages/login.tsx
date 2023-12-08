import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import RootLayout from '@/components/layout';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const result = await signIn('credentials', {
      redirect: false, 
      username,
      password,
    });
  
    if (result.error) {
      console.error('Failed to sign in:', result.error);
    } else {
      router.push('/');
    }
  };
  

  return (
    <RootLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login to My Diary</h2>

            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="username" className="block text-sm text-gray-700">Username</label>
                <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
                />
            </div>

            <div className="mb-6">
                <label htmlFor="password" className="block text-sm text-gray-700">Password</label>
                <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
                />
            </div>

            <button type="submit" className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:bg-purple-700">Log In</button>
            </form>

            <div className="mt-6 text-center">
            <p className="text-sm text-black">Don't have an account? <Link href="/signup" className="text-purple-600 hover:underline">Sign up</Link></p>
            </div>
        </div>
        </div>
    </RootLayout>
  );
};

export default LoginPage;
