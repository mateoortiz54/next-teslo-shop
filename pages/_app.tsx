import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import {ThemeProvider, CssBaseline} from '@mui/material'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { AuthProvider, CartProvider, UiProvider } from '@/context'
import { lightTheme } from '@/themes'
import { SWRConfig } from 'swr'

import '@/styles/globals.css'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{"client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT || ''}}>
        <SWRConfig 
        value={{
          // refreshInterval: 3000,
          fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
        }}
        >
          <AuthProvider>
            <CartProvider>

              <UiProvider>
                <ThemeProvider theme={lightTheme}>
                  {/* Nada va a funcionar proveniente del tema si no le ponemos le CssBaseline */}
                  <CssBaseline/>
                  <Component {...pageProps} />

                </ThemeProvider>

              </UiProvider>

            </CartProvider>

          </AuthProvider>

        </SWRConfig>
      
      </PayPalScriptProvider>  
    </SessionProvider> 
  )
}
