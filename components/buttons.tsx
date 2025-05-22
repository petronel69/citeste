import { ReactNode } from "react";

export function PrimaryButton(props: {type?: "button" | "submit" | "reset", disabled?: boolean, text: ReactNode | string}) {
    return <button type={props.type} disabled={props.disabled} className="bg-blue-400 hover:bg-blue-300 hover:text-blue-600 hover:cursor-pointer text-gray-100 rounded-md shadow-sm border border-gray-200 mb-4 transition-all duration-200 ease-in-out px-4 py-2">{props.text}</button>;
}