import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export default NextAuth({
  
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password:  { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ username: credentials.username });

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error('Invalid username or password');
        }

        return { id: user._id, username: user.username };
      },
    }),
  ],

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  
  debug: process.env.NODE_ENV === 'development',
  database: process.env.DATABASE_URL,
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
