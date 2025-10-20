// env.d.ts

/// <reference types="expo" />

// 1. For use with `process.env.VAR` (which you currently have)
declare namespace NodeJS {
    interface ProcessEnv {
      readonly GOOGLE_WEB_CLIENT_ID: string;
      readonly GOOGLE_IOS_CLIENT_ID: string;
      readonly GOOGLE_ANDROID_CLIENT_ID: string;
    }
}

// 2. For use with `import { VAR } from '@env'` (Recommended by the Babel plugin)
declare module '@env' {
    export const GOOGLE_WEB_CLIENT_ID: string;
    export const GOOGLE_IOS_CLIENT_ID: string;
    export const GOOGLE_ANDROID_CLIENT_ID: string;
}