import { Inter } from 'next/font/google';
import Navbar from './Navbar';  

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <div className={inter.className}>
      <Navbar />  
      <main>{children}</main>
    </div>
  );
}
