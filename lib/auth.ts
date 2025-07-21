import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb";

// Simple in-memory user store (replace with database in production)
const users: any[] = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    password: "demo123", // In production, this should be hashed
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if this is a signup (has name field)
        if (credentials.name) {
          // Check if user already exists
          const existingUser = users.find(user => user.email === credentials.email);
          if (existingUser) {
            throw new Error("User already exists with this email");
          }

          // Create new user
          const newUser = {
            id: (users.length + 1).toString(),
            name: credentials.name,
            email: credentials.email,
            password: credentials.password, // In production, hash this
          };
          
          users.push(newUser);
          console.log("New user created:", newUser);
          
          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            image: null,
          };
        } else {
          // This is a login attempt
          const user = users.find(
            user => user.email === credentials.email && user.password === credentials.password
          );

          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: null,
            };
          }
        }

        return null;
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/", // Use our custom sign-in page (sidebar)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 