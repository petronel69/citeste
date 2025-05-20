//https://github.com/nimone - code modified by Andrei Dascalu

'use client'
import { ChevronFirst, ChevronLast, MoreVertical, LogOut } from "lucide-react"
// import logo from "@/public/bookshare.png"
// import profile from "../assets/profile.png"
import { useSession } from "next-auth/react";
import { createContext, useContext, useState } from "react"
import Link from "next/link"
import { usePathname } from 'next/navigation'

export const SidebarContext = createContext({expanded: true});

export default function Sidebar({ children } : {children: React.ReactNode}) {
    const [expanded, setExpanded] = useState(true)
    const { data: session } = useSession()
    return (
        <>
            <aside className="h-screen sticky top-0">
                <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <p className={`overflow-hidden transition-all mx-2 ${expanded ? "w-32 font-semibold text-xl text-blue-600 select-none" : "w-0 font-semibold text-xl text-blue-600 select-none"}`} >citește</p>
                        <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                            {expanded ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>

                    <SidebarContext.Provider value={{expanded}}>

                        <ul className="flex-1 px-3">{children}</ul>
                    </SidebarContext.Provider>

                    <div className="border-t flex p-3">
                        {/* <img src={profile} className="w-10 h-10 rounded-md" /> */}
                        <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-full ml-3" : "w-0"} `}>
                            <div className="leading-4">
                                <h4 className="font-semibold">{session?.user?.name}</h4>
                                <span className="text-xs text-gray-600">{session?.user?.email}</span>
                            </div>
                            <Link href="/api/auth/signout" className={`flex items-center justify-center rounded-md p-2 hover:bg-gray-100 transition-all ${expanded ? "w-10 h-10" : "w-0 h-0"}`}>
                                {/* <img src={logo} className="w-8 h-8 rounded-md" /> */}
                            <LogOut size={20} />
                            </Link>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    )
}

export function SidebarItem({ icon, text, active = false, alert = false, href = ""}: { icon: React.ReactNode, text: string, active?: boolean, alert?: boolean, href?: string}) {
    const { expanded } = useContext(SidebarContext)
    const currentPath = usePathname()
    return (
        <Link href={href}><li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${(href == "/" && currentPath == "/" || href && href != "/" && currentPath.substring(1).includes(href.substring(1)) || active) ? "bg-gradient-to-tr from-blue-200 to-blue-100 text-blue-800" : "hover:bg-blue-50 text-gray-600"}`}>
            {icon}
            <p className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</p>
            {alert && (
                <div className={`absolute right-2 w-2 h-2 rounded bg-blue-400 ${expanded ? "" : "top-2"}`}>

                </div>
            )}

            {!expanded && (
                <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-blue-100 text-blue-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                    {text}
                </div>
            )}
        </li>
        </Link>
    )
}

