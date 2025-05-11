'use client';

import { useEffect, useState } from 'react';
import { PrimaryButton } from '@/components/buttons';
import { requestJoinClass, State } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function Page() {
  const initialState: State = { status: null, message: "" };
  const [state, formAction] = useActionState(requestJoinClass, initialState);
  let [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (state.status === 'error') {
      setError(state.message);
    }
    if(state.status === 'success') {
      setError(null);
      window.location.href = '/clase';
    }
  }
  , [state]);
  return (
    <div>
      <form
        className="flex flex-col gap-4 w-full max-w-md mx-auto p-4 rounded-md shadow-md bg-gray-100 my-50"
        action={formAction}
      >
        <h2 className="text-3xl">Alatură-te unei clase noi</h2>
        <div className="flex flex-col gap-2">
          <label className="text-lg" htmlFor="name">
            Codul clasei
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            type="text"
            name="join_code"
            required
            id="join_code"
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <PrimaryButton text="Alatură-te" type="submit"></PrimaryButton>
      </form>
    </div>
  );
}

