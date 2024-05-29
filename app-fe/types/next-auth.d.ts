import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      // Add other custom fields if necessary
    };
  }

  interface User {
    id: string;
    email: string;
    // Add other custom fields if necessary
  }
}