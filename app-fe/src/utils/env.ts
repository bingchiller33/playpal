function loadenv(name: string) {
    return process.env[name] || console.warn(`Failed to load env ${name}}!`)!;
}

export const MONGO_URI = loadenv("MONGO_URI");
export const EMAIL_USER = loadenv("EMAIL_USER");
export const EMAIL_PASS = loadenv("EMAIL_PASS");
export const NEXTAUTH_URL = loadenv("NEXTAUTH_URL");
export const NEXTAUTH_SECRET = loadenv("NEXTAUTH_SECRET");
export const PUSHER_APP_ID = loadenv("PUSHER_APP_ID");
export const PUSHER_SECRET = loadenv("PUSHER_SECRET");
export const NEXT_PUBLIC_PUSHER_KEY =
    process.env.NEXT_PUBLIC_PUSHER_KEY ||
    console.warn(`Failed to load env NEXT_PUBLIC_PUSHER_KEY}!`)!;
export const NEXT_PUBLIC_PUSHER_CLUSTER =
    process.env.NEXT_PUBLIC_PUSHER_CLUSTER ||
    console.warn(`Failed to load env NEXT_PUBLIC_PUSHER_CLUSTER}!`)!;

export const NEXT_PUBLIC_PUSHER_INSTANCE_ID =
    process.env.NEXT_PUBLIC_PUSHER_INSTANCE_ID ||
    console.warn(`Failed to load env NEXT_PUBLIC_PUSHER_INSTANCE_ID}!`)!;

export const PUSHER_BEAM_SECRET = loadenv("PUSHER_BEAM_SECRET");
