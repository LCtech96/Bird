import type { Metadata } from "next"
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
})
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap"
})

export const metadata: Metadata = {
  title: "Bird Restaurant - Cucina di Pesce a Terrasini",
  description: "Ristorante di pesce a Terrasini, Sicilia. Cucina tradizionale siciliana con ingredienti freschi del territorio.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${inter.className} ${playfair.variable} ${cormorant.variable} relative`}>
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-b from-muted/20 to-background" />
        <div className="relative z-10 min-h-screen">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
