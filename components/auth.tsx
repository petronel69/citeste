import { PrimaryButton } from "@/components/buttons"
import { signInAction, signOutAction } from "@/app/lib/actions"
 
export function SignInButton() {
  return (
    <form
      action={signInAction}
    >
      <PrimaryButton type="submit">Sign In</PrimaryButton>
    </form>
  )
}

export function SignOutButton() {
  return (
    <form
      action={signOutAction}
    >
      <PrimaryButton type="submit">Sign Out</PrimaryButton>
    </form>
  )
}