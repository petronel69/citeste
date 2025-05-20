"use client"

import { useState } from "react";

import { Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Test(props: {test_data: {intrebare: string, raspunsuri: string[], raspuns_corect: number}[]}) {
    const router = useRouter();
    const { test_data } = props;
    const [answers, setAnswers] = useState<number[]>([]);
    const [answerStatus, setAnswerStatus] = useState<string[]>([]);
    let [submitted, setSubmitted] = useState(false);
    let [nota, setNota] = useState(0);
    function handleSubmit() {
        if(submitted) return;
        setSubmitted(true);
        for(let i = 0; i < test_data.length; i++) {
            answerStatus[i] = "incorrect";
            if(answers[i] === test_data[i].raspuns_corect) {
                setNota(++nota)
                answerStatus[i] = "correct";
            }
            setAnswerStatus([...answerStatus]);
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    return (
        <div className="flex flex-col justify-center w-full">
            {submitted && (
                <div className="mb-4 bg-white p-4 rounded-md shadow-md xl:w-1/5 lg:w-1/4 md:w-1/2 w-1/1 mx-auto">
                    <h2 className="text-lg">Nota: {nota}/{test_data.length}</h2>
                </div>
            )}
            <div className="grid grid-cols-1 gap-4 items-center">
            {test_data.map((item: any, index: number) => (
                <div key={index} className="p-4 rounded-md shadow-md bg-white">
                <div className="flex flex-row items-center gap-3">
                <h2 className="text-lg">{item.intrebare}</h2>
                    {submitted && answerStatus[index] === "correct" && (<>
                        <Check className="text-green-500" />
                        <p className="text-green-500">Răspuns corect</p>
                    </>)}
                    {submitted && answerStatus[index] === "incorrect" && (<>
                        <X className="text-red-500" />
                        <p className="text-red-500">Răspuns greșit</p>
                    </>)}
                </div>
                <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2 mt-2">
                    {item.raspunsuri.map((r: string, i: number) => (
                    <button key={i}
                    className={`p-2 rounded-md shadow-md ${submitted ? "hover:cursor-not-allowed" : "hover:cursor-pointer hover:bg-gray-300 hover:text-gray-800"} bg-gray-200
                    ${answers[index] === i ? "bg-gray-400 text-white" : ""}
                    ${answerStatus[index] === "correct" && answers[index] === i && "!bg-green-500 text-white hover:cursor-disabled"}
                    ${test_data[index].raspuns_corect === i && submitted && "bg-green-300 text-white hover:cursor-disabled"}`}
                    disabled={!!answerStatus[index]}
                    onClick={() => {answers[index] = i; setAnswers([...answers])}}>
                        {r}
                    </button>
                    ))}
                </div>
                </div>
            ))}
            </div>
             {!submitted && <p className="text-sm text-gray-500 mx-auto mt-2">Te rog raspunde la toate intrebarile si apasa butonul de mai jos pentru a trimite raspunsurile.</p>}
             {!submitted && <button className={`mt-4 p-2 text-white rounded-md shadow-md bg-blue-500 hover:cursor-pointer hover:bg-blue-400 xl:w-1/5 lg:w-1/4 md:w-1/2 w-1/1 mx-auto text-center`} onClick={() => {handleSubmit();}}>Trimite raspunsurile</button>}
             {submitted && <button onClick={() => window.location.reload()} className="mt-4 p-2 text-white rounded-md shadow-md bg-blue-500 hover:cursor-pointer hover:bg-blue-400 xl:w-1/5 lg:w-1/4 md:w-1/2 w-1/1 mx-auto text-center">Genereaza alt test</button>}
             {/* foloseste url params sa salvezi stateu formului de generare a testului */}
        </div>
    )
}