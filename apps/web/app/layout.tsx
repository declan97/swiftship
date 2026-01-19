import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from '@/components/providers/convex-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/providers/toast-provider';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SwiftShip - AI-Powered iOS App Generator',
  description: 'Generate native iOS apps from natural language using AI. Export complete Xcode projects.',
  keywords: ['iOS', 'Swift', 'SwiftUI', 'AI', 'code generation', 'app builder'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
