import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import RootLayout from '../components/layout'; 

const Home = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  console.log(session);
  return (
    <RootLayout>
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 min-h-screen flex flex-col justify-center py-12">
        <Head>
          <title>My Personal Diary</title>
          <meta name="description" content="Your private space to capture and reflect on daily thoughts and experiences." />
        </Head>

        <div className="container mx-auto px-4">
          <header className="text-center mb-10">
            <h1 className="text-5xl md:text-7xl text-white font-bold mb-4">Capture Your Daily Moments</h1>
            <p className="text-xl text-white mb-8">Join a safe and private space to record your thoughts, feelings, and daily experiences.</p>
            {!isLoggedIn ? (
              <Link href="/signup" className="bg-white text-purple-600 py-3 px-6 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Your Journey
              </Link>
            ) : (
              <h2 className="text-xl text-white mb-8">Welcome!</h2>
            ) }
          
          </header>

          <section className="text-white grid md:grid-cols-2 gap-8">
            <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">
              <h2 className="text-3xl font-semibold mb-3">Reflect on Your Day</h2>
              <p className="mb-3">Record and reflect on your daily activities, thoughts, and experiences in your personal space. Look back and see how you've grown over time.</p>
            </div>

            <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">
              <h2 className="text-3xl font-semibold mb-3">Mood Tracking</h2>
              <p className="mb-3">Keep track of your mood patterns and understand your emotional well-being. Gain insights into what makes you happy, stressed, or motivated.</p>
            </div>

            <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">
              <h2 className="text-3xl font-semibold mb-3">Privacy First</h2>
              <p className="mb-3">Your entries are private and secure. You have full control over your diary, ensuring a safe place to express yourself freely.</p>
            </div>

            <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">
              <h2 className="text-3xl font-semibold mb-3">Easy to Use</h2>
              <p className="mb-3">A simple, intuitive interface makes it easy to jot down notes, record your current mood, write down your goals for the day, and revisit past memories, anytime, anywhere.</p>
            </div>
          </section>
        </div>
      </div>
    </RootLayout>
  );
};

export default Home;
