import { renderToString } from 'solid-js/web';
import App from './App.js';
interface manifest {
  [ key: string ]: string;
}

export function render ( url?: string, ssrManifest?: manifest ) {
  const html = renderToString( () => <App /> );
  return { html };
}
