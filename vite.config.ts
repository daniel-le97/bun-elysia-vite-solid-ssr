import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
// import dns from "node:dns"
// import {app} from "./index.js"
// dns.setDefaultResultOrder("verbatim")
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [solid({ ssr: true })]
})
