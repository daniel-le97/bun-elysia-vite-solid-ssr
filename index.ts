import Elysia from "elysia";
import { generateHydrationScript } from "solid-js/web";
import { elysiaConnect } from 'elysia-connect';
import { createAuthMiddleware } from 'authey';
import { authConfig } from "./server/plugins/auth.ts";
import { autoroutes } from 'elysia-autoroutes';
import elysiaViteServer from "./server/plugins/vite.ts";


// our main Elysia server, that we are mounting other Elysia instances/(route/handlers) to 
export const app = new Elysia()
    // by default this will server from "/"
    .use( await elysiaViteServer( { injectHeadScript: generateHydrationScript() } ) )
    // add auth.js authentication
    .use( elysiaConnect( createAuthMiddleware( authConfig ) ) )
    // here we are registering /server/routes as a file system router directory for ease of use, 
    .use( autoroutes( { routesDir: './server/routes', prefix: '/api' } ) )
    .listen( 5173, ( ctx ) => console.log( `Elysia + vite + solid server listening on http://${ ctx.hostname }:${ ctx.port }` ) );

export type App = typeof app