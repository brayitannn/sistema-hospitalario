interface DashHeaderProps {
  userEmail?: string
}

export default function DashHeader({ userEmail }: DashHeaderProps) {
  return (
    <header>
      <h1>Dashboard</h1>
      <span>{userEmail}</span>
    </header>
  )
}