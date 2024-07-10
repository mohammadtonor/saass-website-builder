import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider';
import ModalProvider from '@/providers/modal-provider';
import { Toaster } from '@/components/ui/toaster';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Plura',
  description: 'All in one Agency Solution',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModalProvider>
            {children}
            <Toaster />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
