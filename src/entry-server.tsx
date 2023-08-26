import { renderToString } from 'solid-js/web'
// @ts-ignore
import App from './App.tsx'
interface manifest {
  [key:string]: string
}

export function render(url?: string, ssrManifest?: manifest) {
  const html = renderToString(() => <App />)
  return {html}
}
