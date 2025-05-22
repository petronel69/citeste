import Link from "next/link";
import { ReactNode } from "react";
export default function Card(props: {title: string, description: ReactNode, href: string, footer: string}) {
    const { title, description, href, footer } = props;
    return <>
    <div className="bg-white p-4 rounded-md shadow-md max-w-md flex flex-col justify-between text-center">
      <h2 className="font-semibold text-lg">{title}</h2>
      {description}
      <Link href={href}>
        <p className="text-blue-500 hover:text-gray-700 p-2 rounded-md bg-blue-50">{footer}</p>
      </Link>
    </div>
    </>
}