import { useEffect } from "react"

export default function confirmPageLeave(active = true) {
  const beforeUnloadListener = (event: any) => {
    event.preventDefault()
    return (event.returnValue = "")
  }

  useEffect(() => {
    if (active) {
      addEventListener("beforeunload", beforeUnloadListener)
    } else {
      removeEventListener("beforeunload", beforeUnloadListener)
    }
  }, [active])
}