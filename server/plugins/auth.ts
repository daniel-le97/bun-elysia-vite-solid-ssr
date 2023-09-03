import { AuthConfig } from "@auth/core";
import GithubProvider from "@auth/core/providers/github";

export const authConfig: AuthConfig = {
    // You can generate a secret here https://generate-secret.vercel.app/32
    secret: process.env.AUTH_SECRET,
    trustHost: Boolean( process.env.AUTH_TRUST_HOST ),
    providers: [
        // OAuth authentication providers
        GithubProvider( {
            clientId: Bun.env.GITHUB_CLIENT_ID,
            clientSecret: Bun.env.GITHUB_CLIENT_SECRET
        } )
        //   AppleProvider({
        //     clientId: process.env.APPLE_ID,
        //     clientSecret: process.env.APPLE_SECRET,
        //   }),
        //   GoogleProvider({
        //     clientId: process.env.GOOGLE_ID,
        //     clientSecret: process.env.GOOGLE_SECRET,
        //   }),
        //   // Sign in with passwordless email link
        //   EmailProvider({
        //     server: process.env.MAIL_SERVER,
        //     from: '<no-reply@example.com>',
        //   }),
    ],
};