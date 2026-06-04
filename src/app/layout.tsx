import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { NavigationProvider } from "@/components/navigation-provider";
import { UserProvider } from "@/components/user-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ajaia Docs",
  description: "A lightweight collaborative document workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <NavigationProvider>
            <AppHeader />
            {children}
          </NavigationProvider>
        </UserProvider>
      </body>
    </html>
  );
}
