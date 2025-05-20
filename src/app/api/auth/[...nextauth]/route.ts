import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findUserByEmail } from "@/models/users";
import {findAdminByEmail} from "@/models/admin"
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("credentials", credentials);
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos");
        }
        const user = await findUserByEmail(credentials.email);
        const admin = await findAdminByEmail(credentials.email);
      
        const target = user || admin;
        if (!target) throw new Error("Usuario no encontrado");

        const validPassword = await bcrypt.compare(
          credentials.password,
          target.password
        );
        if (!validPassword) throw new Error("Contraseña incorrecta");
      
        return {
          id: target.id.toString(),
          name: target.nombre,
          email: target.correo,
          role: user ? "user" : "admin",
        };
      }      
    })
  ],

  callbacks: {
    jwt({ account, token, user, profile, session }) {
      if (user) token.user = user;
      return token;
    },
    session({ session, token }) {
      session.user = token.user as any;
      console.log("session", session);
      return session;
    },
  },
  pages: {   
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
