import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: User
  }
  interface User {
    _id: string
    name: string
    email: string
    password: string
  }
}
