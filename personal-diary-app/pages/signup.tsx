import Link from 'next/link';
import { useState } from 'react';
import RootLayout from '@/components/layout';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import axios from 'axios';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); 

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
  
    try {
      const response = await axios.post('/api/auth/signup', {
        username,
        password,
      });
  
      if (response.status === 201) {
        const result = await signIn('credentials', {
          redirect: false,
          username,
          password,
        });
  
        if (!result.error) {
          router.push('/');
        } else {
          setError(result.error || 'Login after signup failed');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    }
  };
  

  return (
    <RootLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Sign Up for My Diary</h2>
            {error && <div className="text-red-600 text-center bg-red-300 rounded-sm">{error}</div>}

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

            <div className="mb-4">
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

            <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm text-gray-700">Confirm Password</label>
                <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
                />
            </div>

            <button type="submit" className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:bg-purple-700">Sign Up</button>
            </form>

            <div className="mt-6 text-center">
            <p className="text-sm text-black">Already have an account? <Link href="/login" className="text-purple-600 hover:underline">Log in</Link></p>
            </div>
        </div>
        </div>
    </RootLayout>
  );
};

export default SignupPage;
