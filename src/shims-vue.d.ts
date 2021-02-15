/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.gif' {
  export const gif: any
}

declare module 'nprogress'

declare module 'js-cookie'

declare module 'path-to-regexp'

declare module 'screenfull'
