"use client";

import { useState, useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/feature/auth/authSlice";
import { 
  useGetTasksQuery, 
  useCreateTaskMutation, 
  useUpdateTaskMutation, 
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation
} from "@/redux/feature/tasks/tasksApi";
import { useGetUsersQuery } from "@/redux/feature/users/usersApi";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MoreVertical, 
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  ChevronDown,
  LayoutGrid,
  List,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent, 
} from "@/components/ui/sheet";
import TMSForm from "@/components/form/TMSForm";
import TMSInput from "@/components/form/TMSInput";
import TMSTextArea from "@/components/form/TMSTextArea";
import TMSSelect from "@/components/form/TMSSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/api";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  assignedToId: z.string().nullable().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Awaiting Action", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10" },
  PROCESSING: { label: "In Operation", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
  DONE: { label: "Success Unit", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
};

export default function TasksPage() {
  const user = useAppSelector(selectCurrentUser);
  const { data: tasksRes, isLoading: tasksLoading } = useGetTasksQuery(undefined);
  const { data: usersRes } = useGetUsersQuery(undefined, { skip: user?.role !== "ADMIN" });
  
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const tasks = tasksRes?.data || [];
  const users = usersRes?.data || [];

  const filteredTasks = useMemo(() => {
    return tasks.filter((task: any) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

  const handleSubmit = async (values: TaskFormValues) => {
    try {
      if (editingTask) {
        await updateTask({ id: editingTask.id, ...values }).unwrap();
        toast.success("Registry unit updated");
      } else {
        await createTask(values).unwrap();
        toast.success("New operation unit initialized");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Operational failure");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure? This action is irreversible.")) return;
    try {
      await deleteTask(id).unwrap();
      toast.success("Unit purged from registry");
    } catch (err: any) {
      toast.error("Process failure");
    }
  };

  const handleStatusChange = async (
    id: string,
    status: TaskStatus,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    try {
      await updateTaskStatus({ id, status }).unwrap();
      toast.success("Task status updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  if (tasksLoading) return <Skeleton className="h-[600px] w-full bg-slate-50 dark:bg-slate-900 rounded-[32px]" />;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
           <h1 className="text-[40px] font-extrabold tracking-tight text-[#1e293b] dark:text-white leading-none capitalize">Task Registry</h1>
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Operational Pipeline Management</p>
        </div>
        {user?.role === "ADMIN" && (
          <Button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} size="lg" className="rounded-xl px-10 h-12 font-black uppercase text-[10px] tracking-widest bg-slate-900 shadow-xl shadow-slate-200 dark:shadow-none active:scale-95 transition-all">
            <Plus className="mr-2 h-4 w-4" strokeWidth={3} /> Initialize Operation
          </Button>
        )}
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
          <Input 
            placeholder="Lookup registry by unit title..." 
            className="pl-12 h-14 bg-white dark:bg-slate-900/50 border-none rounded-2xl shadow-pro text-sm font-medium placeholder:text-slate-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-14 bg-white dark:bg-slate-900/50 border-none rounded-2xl px-6 font-bold text-xs uppercase tracking-widest flex justify-between gap-10 min-w-[220px] shadow-pro">
                    <div className="flex items-center gap-3">
                       <Filter size={16} className="text-slate-300" />
                       <span className="text-slate-500">{statusFilter === "ALL" ? "Global Filter" : statusFilter}</span>
                    </div>
                    <ChevronDown size={14} className="opacity-30" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[220px] p-2 rounded-2xl shadow-premium border-slate-100">
                 {["ALL", "PENDING", "PROCESSING", "DONE"].map(s => (
                   <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)} className="p-3 font-bold text-[10px] uppercase tracking-widest rounded-xl">{s}</DropdownMenuItem>
                 ))}
              </DropdownMenuContent>
           </DropdownMenu>
           
           <div className="flex bg-white dark:bg-slate-900/50 p-1 rounded-2xl shadow-pro">
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-primary bg-primary/5"><List size={18} /></Button>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-slate-300"><LayoutGrid size={18} /></Button>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 shadow-pro rounded-[32px] overflow-hidden border border-slate-50/50 dark:border-slate-800/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50/50 border-slate-50 dark:border-slate-800/50">
              <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Operation Unit</TableHead>
              <TableHead className="py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Operational Status</TableHead>
              <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Personnel Assignment</TableHead>
              <TableHead className="py-6 text-right pr-14 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Initialization</TableHead>
              <TableHead className="text-right px-10 py-6 w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-80 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 italic">Operational Registry Empty.</TableCell></TableRow>
            ) : (
              filteredTasks.map((task: any) => (
                <TableRow 
                  key={task.id} 
                  className="group cursor-pointer hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all border-slate-50/50 dark:border-slate-800/50"
                  onClick={() => { setSelectedTask(task); setIsDetailOpen(true); }}
                >
                  <TableCell className="px-10 py-6">
                    <div className="font-extrabold text-[15px] tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">{task.title}</div>
                    <div className="text-[10px] text-slate-300 font-bold uppercase mt-1">Node identifier: {task.id.slice(-8)}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn("border-none px-5 py-2 font-black text-[9px] uppercase tracking-widest rounded-full shadow-sm outline-none", statusMap[task.status]?.bg, statusMap[task.status]?.color)}>
                      {statusMap[task.status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-4">
                        <Avatar className="h-9 w-9 border-4 border-white dark:border-slate-800/10 group-hover:border-primary transition-all shadow-sm">
                           <AvatarFallback className="text-[10px] font-black bg-slate-50 dark:bg-slate-800">{task.assignedTo?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-black text-slate-600 dark:text-slate-400 capitalize">{task.assignedTo?.name || "Unassigned"}</span>
                     </div>
                  </TableCell>
                  <TableCell className="text-right pr-14">
                     <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-500 dark:text-slate-300 tracking-tight">{format(new Date(task.createdAt), "MMM d, yyyy")}</span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Deploy Cycle</span>
                     </div>
                  </TableCell>
                  <TableCell className="px-10 text-right">
                    <DropdownMenu>
                       <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-pro">
                             <MoreVertical size={18} className="text-slate-400" />
                          </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="w-[200px] rounded-[24px] shadow-premium p-2 border-slate-100/50">
                          <DropdownMenuItem onClick={() => { setSelectedTask(task); setIsDetailOpen(true); }} className="p-3 font-bold text-xs gap-4 rounded-xl"><Eye size={16} className="text-slate-300" /> Inspect Unit</DropdownMenuItem>
                          {user?.role === "ADMIN" && (
                            <>
                              <DropdownMenuItem onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="p-3 font-bold text-xs gap-4 text-indigo-600 rounded-xl"><Pencil size={16} /> Modify Parameters</DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleDelete(task.id, e)} className="p-3 font-bold text-xs gap-4 text-rose-500 rounded-xl"><Trash2 size={16} /> Purge Registry</DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={(e) => handleStatusChange(task.id, "PENDING", e)} className="p-3 font-bold text-xs gap-4 rounded-xl">Set Pending</DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleStatusChange(task.id, "PROCESSING", e)} className="p-3 font-bold text-xs gap-4 rounded-xl">Set Processing</DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleStatusChange(task.id, "DONE", e)} className="p-3 font-bold text-xs gap-4 rounded-xl">Set Done</DropdownMenuItem>
                       </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Task Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-xl p-0 border-l-0 shadow-2xl bg-white dark:bg-slate-950">
           <AnimatePresence>
            {selectedTask && (
              <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="h-full flex flex-col">
                  <header className="px-12 pt-24 pb-12 border-b border-slate-50 dark:border-slate-900/50">
                     <div className="flex items-center gap-4 mb-10">
                        <Badge variant="outline" className={cn("border-none px-5 py-2 font-black text-[10px] uppercase tracking-[0.2em] rounded-full", statusMap[selectedTask.status]?.bg, statusMap[selectedTask.status]?.color)}>
                           {selectedTask.status}
                        </Badge>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Node {selectedTask.id.slice(-8)}</span>
                     </div>
                     <h2 className="text-5xl font-extrabold tracking-tighter text-[#1e293b] dark:text-white leading-[0.9]">{selectedTask.title}</h2>
                  </header>
                  <div className="flex-1 p-12 overflow-auto custom-scrollbar space-y-16">
                     <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-4">
                           <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Operational Assignee</p>
                           <div className="flex items-center gap-4 bg-[#f8faff] dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-50/50 dark:border-slate-800">
                              <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800/10 shadow-sm">
                                 <AvatarFallback className="text-[11px] font-black">{selectedTask.assignedTo?.name?.charAt(0) || "U"}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                 <span className="text-sm font-black text-slate-700 dark:text-slate-200 capitalize">{selectedTask.assignedTo?.name || "Unassigned"}</span>
                                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Personnel</span>
                              </div>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Deployment Metadata</p>
                           <div className="flex items-center gap-4 bg-[#f8faff] dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-50/50 dark:border-slate-800">
                              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                 <Calendar size={18} className="text-[#3b82f6]" strokeWidth={2.5} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-black text-slate-700 dark:text-slate-200">{format(new Date(selectedTask.createdAt), "PPP")}</span>
                                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Registry Date</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-6 pt-12 border-t border-slate-50 dark:border-slate-900">
                        <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Documentation Layer</p>
                        <div className="text-[15px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                           {selectedTask.description || "Operational parameters for this unit have not been indexed."}
                        </div>
                     </div>
                  </div>
              </motion.div>
            )}
           </AnimatePresence>
        </SheetContent>
      </Sheet>

      {/* Operation Unit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 border-none shadow-premium rounded-[40px] overflow-hidden sm:max-w-xl bg-white dark:bg-slate-950">
           <DialogHeader className="p-12 pb-8">
             <DialogTitle className="text-3xl font-black uppercase tracking-tight text-[#1e293b] dark:text-white leading-none">{editingTask ? "Update Registry" : "Initialize Unit"}</DialogTitle>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">{editingTask ? "Modification of operational parameters." : "Provisioning of a new architectural task unit."}</p>
           </DialogHeader>
           <TMSForm
            onSubmit={handleSubmit}
            resolver={zodResolver(taskSchema)}
            defaultValues={{
              title: editingTask?.title || "",
              description: editingTask?.description || "",
              assignedToId: editingTask?.assignedToId || null,
            }}
          >
            <div className="p-12 pt-4 space-y-8">
               <TMSInput 
                name="title" 
                label="Unit Identifier" 
                placeholder="Strategic descriptor..." 
                className="bg-[#f0f4ff]/50 border-none h-14 rounded-xl px-1 font-bold" 
                required 
               />
               <TMSTextArea 
                name="description" 
                label="Contextual Layer" 
                placeholder="Architectural breakdown..." 
                className="bg-[#f0f4ff]/50 border-none rounded-xl font-bold min-h-[120px]"
               />
               {user?.role === "ADMIN" && (
                <TMSSelect
                  name="assignedToId"
                  label="Personnel Assignment"
                  placeholder="Select active participant"
                  options={[{ label: "Unassigned / Open Pool", value: "" }, ...users.map((u: any) => ({ label: u.name, value: u.id }))]}
                />
               )}
            </div>
            <DialogFooter className="p-12 pt-4 flex flex-col sm:flex-row gap-4">
               <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold uppercase tracking-widest text-[10px] px-10 h-14 hover:bg-slate-50">Cease Action</Button>
               <Button type="submit" disabled={isCreating || isUpdating} className="flex-1 rounded-xl font-black uppercase tracking-widest text-[10px] px-10 h-14 bg-slate-900 shadow-xl shadow-slate-200 dark:shadow-none active:scale-95 transition-all">
                  {editingTask ? "Deploy Update" : "Launch Operational Unit"}
               </Button>
            </DialogFooter>
           </TMSForm>
        </DialogContent>
      </Dialog>
    </div>
  );
}
