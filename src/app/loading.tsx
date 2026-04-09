import { AppLogo } from '@/components/shared/AppLogo'

export default function Loading() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4 animate-in fade-in duration-500">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-bounce shadow-xl shadow-indigo-100 dark:shadow-none bg-card border">
        <AppLogo size={44} priority />
      </div>
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-2xl font-black tracking-tighter">TMS</h2>
        <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-progress origin-left" />
        </div>
      </div>
    </div>
  )
}
