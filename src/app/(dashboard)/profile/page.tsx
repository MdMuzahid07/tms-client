"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/feature/auth/authSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  ShieldCheck, 
  Globe,
  Bell,
  Lock,
  User as UserIcon,
  Activity,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Senior-level Account Settings.
 * Focused on executive minimalism, surgical spacing, and high-quality information rhythm.
 */
export default function ProfilePage() {
  const user = useAppSelector(selectCurrentUser);

  if (!user) return null;

  const sections = [
    { label: "Executive Profile", icon: UserIcon, active: true },
    { label: "Security Protocols", icon: Lock },
    { label: "Event Notifications", icon: Bell },
    { label: "Geographical Units", icon: Globe },
    { label: "Financial Ledger", icon: CreditCard },
  ];

  return (
    <div className="space-y-12 max-w-6xl animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div>
           <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase transition-colors">
              Account Management
           </h1>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Personal Identity & Preferences
           </p>
        </div>
        <Button size="lg" className="rounded-xl px-10 h-12 font-black uppercase text-xs tracking-widest bg-slate-900 shadow-pro">
           Commit Changes
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Registry */}
        <aside className="lg:col-span-1 space-y-1">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-3">Preference Layers</p>
           {sections.map((section) => (
              <button 
                key={section.label}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  section.active 
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl" 
                  : "text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                }`}
              >
                <div className="flex items-center gap-3">
                   <section.icon size={14} />
                   <span>{section.label}</span>
                </div>
                {section.active && <ChevronRight size={12} />}
              </button>
           ))}
        </aside>

        {/* Content Unit */}
        <div className="lg:col-span-3 space-y-10">
           <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
              <header className="h-44 bg-slate-100 dark:bg-slate-800/50 relative overflow-hidden border-b">
                 <div className="absolute top-10 right-10 leading-none text-slate-200 dark:text-slate-800/40 select-none">
                    <UserIcon size={180} strokeWidth={4} />
                 </div>
                 <Avatar className="absolute -bottom-10 left-12 h-28 w-28 border-[6px] border-white dark:border-slate-900 shadow-2xl font-black">
                    <AvatarFallback className="bg-slate-900 text-white text-4xl">{user.name.charAt(0)}</AvatarFallback>
                 </Avatar>
              </header>
              <CardContent className="pt-20 px-12 pb-12">
                 <div className="flex justify-between items-start mb-12">
                    <div>
                       <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none capitalize">{user.name}</h2>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{user.email}</p>
                    </div>
                    <Badge variant="outline" className="px-5 py-2 font-black text-[9px] uppercase tracking-[0.3em] rounded-full bg-emerald-50 text-emerald-600 border-none shadow-sm">
                       Verified Access
                    </Badge>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10 border-y border-slate-50 dark:border-slate-800">
                    <div className="space-y-1.5">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Full Identity</p>
                       <p className="text-[13px] font-black bg-slate-50/50 dark:bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 capitalize">{user.name}</p>
                    </div>
                    <div className="space-y-1.5">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Corporate Stream</p>
                       <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800">
                          <Mail size={14} className="text-slate-400" />
                          <p className="text-[12px] font-black lowercase tracking-tighter">{user.email}</p>
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Operational Role</p>
                       <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 text-[12px] font-black uppercase tracking-widest">
                          <ShieldCheck size={14} className="text-slate-400" />
                          {user.role}
                       </div>
                    </div>
                 </div>

                 <div className="mt-10">
                    <h4 className="text-[12px] font-black uppercase tracking-widest mb-4">Workspace Presence</h4>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed mb-8 max-w-xl">
                       Your participant unit is globally synchronized across the primary operational workspace. Changes to core metadata may require administrative authorization tokens.
                    </p>
                    <Button variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 border-slate-200">Modify Personnel Metadata</Button>
                 </div>
              </CardContent>
           </Card>

           <div className="p-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                 <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Active Operational Sessions</h4>
                 <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-sm">If you suspect unauthorized access units, immediately purge all active sessions.</p>
              </div>
              <Button variant="destructive" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 h-11 shadow-lg shadow-destructive/20 border-none">
                 Purge Global Sessions
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
