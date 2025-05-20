'use client';

import { useState } from 'react';
import { PrimaryButton } from '@/components/buttons';
import { createClass, State } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function Page() {
  const initialState: State = { status: "", message: "" };
  const [state, formAction] = useActionState(createClass, initialState);
  return (
    <div>
      <form
        className="flex flex-col gap-4 w-full max-w-md mx-auto p-4 rounded-md shadow-md bg-gray-100 my-50"
        action={formAction}
      >
        <h2 className="text-3xl">Creaza o clasa noua</h2>
        <div className="flex flex-col gap-2">
          <label className="text-lg" htmlFor="name">
            Numele clasei
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            type="text"
            name="name"
            required
            id="name"
          />
        </div>
        <PrimaryButton text="Creaza clasa" type="submit"></PrimaryButton>
      </form>
    </div>
  );
}

