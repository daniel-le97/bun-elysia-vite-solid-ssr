// import Elysia from "elysia";
import type { BunFile } from "bun";
import { error } from "console";
import type { ElysiaConfig } from "elysia";
import type { UserConfig } from "vite";





const isProduction = process.env.NODE_ENV === 'production';

const getTemplateHTML = async ( path?: string ) => {
    let file: string | BunFile;
    file = Bun.file( path || './index.html' )
    if ( isProduction )
    {
        file = Bun.file( path || './dist/client/index.html' )
    }
   if (!file) {
        throw new Error('index.html not found at ' + `${ path || './index.html'}`)
   }
    return await file.text();
};

function assignDefaults<T>(target: T, defaults: T) {
    for (const key in defaults) {
        if (typeof target[key] === 'undefined') {
            target[key] = defaults[key];
        } else if (typeof target[key] === 'object' && typeof defaults[key] === 'object') {
            assignDefaults(target[key], defaults[key]);
        }
    }
    return target;
}

// const UserConfig = (await import('vite')).build

type Options = {
    entryServer?: string,
    headReplace?: string,
    htmlReplace?: string,
    base?: string,
    indexHTML?: string,
    vite?: UserConfig,
    injectHeadScript?: string,
    ssrManifest?: string
    port?: 5173,
    elysia?: ElysiaConfig

};
const opts: Options = {
    entryServer: `${ process.cwd() }/src/entry-server.tsx`,
    headReplace: '<!--app-head-->',
    htmlReplace: '<!--app-html-->',
    base: process.env.BASE || '/',
    indexHTML: await getTemplateHTML(),
    ssrManifest: isProduction
        ? await Bun.file( './dist/client/ssr-manifest.json' ).text()
        : undefined,
    vite: {
        server: { middlewareMode: true },
        appType: 'custom',
        build: { ssr: true },
        base: process.env.BASE || '/',
    } as UserConfig
};


export const elysiaViteServer = async ( options: Options ) => {
    const defaults = assignDefaults(options, opts)
    // console.log(defaults);
    
    const isProduction = process.env.NODE_ENV === 'production';
    const getMiddleWare = async () => {
        let middleWare: any;
        if ( !isProduction )
        {
            const { createServer } = await import( 'vite' );
            const vite = await createServer( opts.vite );
            middleWare = vite;
        } else
        {
            const sirv = ( await import( 'sirv' ) ).default;
            middleWare = sirv( './dist/client', { extensions: [] } );
        }
        if (!middleWare) {
            const name = isProduction ? 'sirv' : 'vite'
            throw new Error(`unable to load ${name} middlewares`)
        }
        return middleWare;
    };
    const indexHtml = defaults.indexHTML
    const Elysia = ( await import( 'elysia' ) ).default;
    const html = ( await import( '@elysiajs/html' ) ).default;
    const middleWare = await getMiddleWare();
    // @ts-ignore
    const { elysiaConnectDecorate } = ( await import( 'elysia-connect' ) );
    const app =  new Elysia()
        .use( html )
        .use( elysiaConnectDecorate() )
        .onBeforeHandle( async ( context ) => {
            // @ts-ignore
            const handled = await context.elysiaConnect( middleWare.middlewares ?? middleWare, context );
            if ( handled ) return handled;
        } )
        .get( '*', async ( context ) => {
            const url = context.request.url;
            let template = defaults.indexHTML

            let render: any;
            if ( !isProduction )
            {
                template = await middleWare.transformIndexHtml( url, template );
                render = ( await middleWare.ssrLoadModule( opts.entryServer ) ).render;
            } else
            {
                render = ( await import( './dist/server/entry-server.js' ) ).render;
            }
            try
            {

                const ssrManifest = opts.ssrManifest;
                const rendered = await render( url, ssrManifest );
                const head = ( rendered.head ?? '' ) + options.injectHeadScript ?? '';
                const html = template!
                    .replace( defaults.headReplace!, head )
                    .replace( defaults.htmlReplace! ,rendered.html ?? '' );

                return context.html( html );

            } catch ( error )
            {
                if ( !isProduction )
                {
                    middleWare.ssrFixStacktrace( error as Error );

                } else
                {
                    console.log( error );
                }
                context.set.status = 500;
                return 'error';

            }
        } );

    return app;


};
