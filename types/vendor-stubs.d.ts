declare module '@neondatabase/neon-js/auth' {
  export function createAuthClient(url: string): unknown;
}

declare module '@neondatabase/neon-js/auth/react' {
  import type { ReactNode } from 'react';
  export function NeonAuthUIProvider(props: { emailOTP?: boolean; authClient: unknown; children: ReactNode }): JSX.Element;
}

declare module '@neondatabase/neon-js/ui/css';
declare module 'react-router-dom' {
  export const BrowserRouter: any;
  export const Link: any;
  export const Navigate: any;
  export const Route: any;
  export const Routes: any;
}
