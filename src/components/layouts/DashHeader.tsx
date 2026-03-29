interface DashHeaderProps {
  userEmail: string;
}

export function DashHeader({ userEmail }: DashHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <p className="text-sm text-gray-500">
        Sistema de Gestión Hospitalaria
      </p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center">
          <span className="text-white text-xs font-semibold">
            {userEmail.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm text-gray-700">{userEmail}</span>
      </div>
    </header>
  );
}