// "use client"
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// export default function Profile() {
//   const { data: session } = useSession();
//   const router = useRouter();

//   if (!session) {
//     router.push('/login');
//     return null;
//   }

//   return (
//     <div>
//       <h1>Welcome, {session.user?.email}</h1>
//       <button>Sign out</button>
//     </div>
//   );
// }