import NextAuth, { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

// 관리자로 허용할 디스코드 사용자 ID 목록
const ADMIN_USER_IDS = process.env.ADMIN_DISCORD_IDS?.split(',') || [];

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = (profile as { id: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { discordId?: string; isAdmin?: boolean }).discordId = token.discordId as string;
        (session.user as { discordId?: string; isAdmin?: boolean }).isAdmin = ADMIN_USER_IDS.includes(token.discordId as string);
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
