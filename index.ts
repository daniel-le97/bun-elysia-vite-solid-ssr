import Elysia from "elysia";
import { generateHydrationScript } from "solid-js/web";
import { elysiaConnect } from 'elysia-connect';
import { createAuthMiddleware } from 'authey';
import { authConfig } from "./server/plugins/auth.ts";
import { autoroutes } from 'elysia-autoroutes';
import elysiaViteServer from "./server/plugins/vite.ts";


// check out server/plugins to see how it works
const client = await elysiaViteServer( { injectHeadScript: generateHydrationScript() } );
export const app = new Elysia()
    .use( client! )
    .use( elysiaConnect( createAuthMiddleware( authConfig ) ) )
    .use( autoroutes( { routesDir: './server/routes', prefix: '/api' } ) )
    .listen( 5173, ( ctx ) => console.log( `Elysia + vite server listening on http://${ ctx.hostname }:${ ctx.port }` ) );

export type App = typeof app