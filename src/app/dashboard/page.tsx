import { auth } from "../../lib/auth"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div>
      <h1>Welcome to your Dashboard, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
      
    </div>
  )
}