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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ username: credentials.username });
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error('Invalid username or password');
        }

        return { id: user._id.toString(), username: user.username }; 
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, 
    updateAge: 24 * 60 * 60, 
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
    maxAge: 30 * 24 * 60 * 60, 
  },

  debug: process.env.NODE_ENV === 'development',

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
