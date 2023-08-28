import Elysia from "elysia";
import { elysiaViteServer } from "./plugin.js";
import { generateHydrationScript } from "solid-js/web";


// check out plugin.ts to see how it works
const client = await elysiaViteServer( { injectHeadScript: generateHydrationScript() } );
const app = new Elysia()
    .use( client )
    .get('/api/hello', () => 'hello')
    .listen( 5173, ( ctx ) => console.log( `Elysia + vite server listening on http://${ ctx.hostname }:${ ctx.port }` ) );


export type App = typeof app