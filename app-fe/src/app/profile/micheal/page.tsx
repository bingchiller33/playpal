"use client"

import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      {/* You can access other user data here, for example: */}
      {/* <p>Your id is {session.user.id}</p> */}
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}

export default MyComponent;
