import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { StoreProvider } from "../store/Provider";
import { StyledComponentsRegistry } from '../lib/registry';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lucy test app',
  description: 'Lucy test app',
}

export default function RootLayout(props: {
  children: React.ReactNode
}) {
  const { children } = props;

  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <StoreProvider>
            <StyledComponentsRegistry>
                {children}
            </StyledComponentsRegistry>
          </StoreProvider>
        </main>
      </body>
    </html>
  )
}
