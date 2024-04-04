import type { Metadata } from "next"
import { Roboto_Mono } from "next/font/google"
import { GlobalContextProvider } from './components/GlobalContextProvider'
import "./globals.css"

const robotoMono = Roboto_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'trevdev.fun',
  description: 'Play games with your friends!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={robotoMono.className}>
        <GlobalContextProvider>
          {children}
        </GlobalContextProvider>
      </body>
    </html>
  )
}
