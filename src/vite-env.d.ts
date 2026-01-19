/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.lottie" {
  const src: string;
  export default src;
}
