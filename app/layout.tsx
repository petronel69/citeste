import { auth } from "@/auth";
import Sidebar, { SidebarItem } from "@/components/sidebar";
import { Book, Home, NotebookText, Pen, Settings } from "lucide-react";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "citeste",
  description: "citeste - Olimpiada Infoeducatie 2025",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider>
      <html lang="en">
        <body className={`antialiased`}>
          <div className="flex">
            <Sidebar>
              <SidebarItem icon={<Home size={20} />} text="Acasă" href={"/"} />
              <SidebarItem icon={<NotebookText size={20} />} text="Clase" href={"/clase"} />
              <SidebarItem icon={<Pen size={20} />} text="Exersează" ai href={"/exerseaza"} />
              <SidebarItem icon={<Book size={20} />} text="Manuale" href={"https://www.manuale.edu.ro/"} />
              <hr className="my-3" />
              <SidebarItem icon={<Settings size={20} />} text="Setări" href={"/setari"} />
            </Sidebar>
            <div className="flex-1 p-4 bg-gray-50">
              {children}
            </div>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
