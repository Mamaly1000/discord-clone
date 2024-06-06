import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ModalProvider from "@/providers/ModalProvider";
import SocketProvider from "@/providers/SocketProvider";
import QueryPrvider from "@/providers/QueryPrvider";
import NotficationProvider from "@/providers/NotficationProvider";
import SoundProvider from "@/providers/SoundProvider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord clone",
  description: "a chat app like discord",
  icons: "./favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider
            storageKey="discord-theme"
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <SocketProvider>
              <SoundProvider>
                <QueryPrvider>
                  <NotficationProvider>
                    <ModalProvider />
                    {children}
                  </NotficationProvider>
                </QueryPrvider>
              </SoundProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
