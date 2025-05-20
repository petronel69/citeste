'use client'
import { UserRoundX, UserRoundCheck } from "lucide-react";

import { useEffect, useState } from 'react';

let [elevi, setElevi] = [[], (elevi: []) => {}];

function kickElev(clasa: string, id_elev: string) {
    const response = fetch('/api/elevi', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_clasa: clasa, id_elev })
    });
    const data = response.then(res => res.json());
    data.then(res => {
        if (typeof setElevi === 'function') {
            setElevi(res);
        }
    });
}

function acceptElev(clasa: string, id_elev: string) {
    const response = fetch('/api/elevi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_clasa: clasa, id_elev })
    });
    const data = response.then(res => res.json());
    data.then(res => {
        if (typeof setElevi === 'function') {
            setElevi(res);
        }
    });
}

export function ElevSkeleton() {
    return (
        <div className="flex items-center justify-between hover:bg-gray-50 rounded-md transition duration-300 p-2">
            <div className="bg-gray-200 h-9 w-1/3 rounded-md animate-pulse"></div>
        </div>
    )
}

export function Elev(props: {clasa: string, elev: any}) {
    const { clasa, elev } = props;
    return (
        <>
            <div className="flex items-center justify-between hover:bg-gray-50 rounded-md transition duration-300 p-2">
                <div>
                    <h3 className="text-lg font-semibold">{elev?.name}</h3>
                    <p className="text-sm text-gray-500">S-a alăturat pe {new Intl.DateTimeFormat('ro', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(elev.created_at))}</p>
                </div>
                {elev.status == "active" && <button
                      onClick={() => kickElev(clasa, elev.id_elev)}
                      className="text-red-500 hover:text-red-800 hover:cursor-pointer transition duration-300 font-semibold flex items-center gap-x-1 bg-red-50 hover:bg-red-100 rounded-md p-2"
                    >
                      <UserRoundX className="h-5 w-5" />
                      Elimină
                    </button>
                }
                {elev.status == "pending" && <button
                      onClick={() => acceptElev(clasa, elev.id_elev)}
                      className="text-green-500 hover:text-green-800 hover:cursor-pointer transition duration-300 font-semibold flex items-center gap-x-1 bg-green-50 hover:bg-green-100 rounded-md p-2"
                    >
                      <UserRoundCheck className="h-5 w-5" />
                      Acceptă
                    </button>
                }
            </div>
        </>
    )
}

export function ListaElevi(props: { clasa: string }) {
    const { clasa } = props;
    [elevi, setElevi] = useState<any>(null);

    useEffect(() => {
        const fetchElevi = async () => {
            try {
                const response = await fetch(`/api/elevi?${clasa}`);
                const data = await response.json();
                setElevi(data);
            } catch (error) {
                console.error('Error fetching elevi:', error);
            }
        };

        fetchElevi();
        let interval = setInterval(() => fetchElevi(), 5000);
        return () => {
            clearInterval(interval);
        }
    }, []);
    

    if(!elevi) {
        return (
            <div className="flex mt-1 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 bg-white p-4 rounded-md shadow-md transition duration-300">
                <ElevSkeleton />
                <ElevSkeleton />
                <ElevSkeleton />
                <ElevSkeleton />
            </div>
        )
    }

    return (
        <div className="mt-1 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 bg-white p-4 rounded-md shadow-md transition duration-300">
            {elevi.length > 0 ? (
                elevi.map((elev: any) => (
                    <Elev elev={elev} key={elev.id_elev} clasa={clasa} />
                ))
            ) : (
                <div className="bg-white p-4 rounded-md text-center text-gray-500 text-sm col-span-5">
                    Această clasă nu are niciun elev
                </div>
            )}
        </div>
    )
}

export function ListaEleviSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <ElevSkeleton />
            <ElevSkeleton />
            <ElevSkeleton />
            <ElevSkeleton />
            <ElevSkeleton />
        </div>
    )
}