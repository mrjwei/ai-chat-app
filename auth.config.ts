import type {NextAuthConfig} from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({user, token, trigger}) {
      if ((trigger === "update" && user) || user) {
        token.id = String(user._id)
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session({session, token}) {
      session.user.id = token.id as string
      session.user.name = token.name as string
      session.user.email = token.email as string
      return session
    }
  },
  providers: []
} satisfies NextAuthConfig;
