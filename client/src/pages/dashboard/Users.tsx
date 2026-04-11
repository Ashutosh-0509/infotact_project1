import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  History, 
  Settings, 
  X,
  Mail,
  Shield,
  Calendar,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/api/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Cashier"
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/users");
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast.error("Could not load users database");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserFormData({ name: "", email: "", password: "", role: "Cashier" });
    setIsModalOpen(true);
  };

  const handleOpenEditUser = (user: any) => {
    setEditingUser(user);
    setUserFormData({ 
      name: user.name, 
      email: user.email, 
      password: "", 
      role: user.role 
    });
    setIsModalOpen(true);
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const { data } = await api.put(`/users/${editingUser._id}`, userFormData);
        if (data.success) {
          toast.success("User profile updated", {
            className: "bg-background border-primary/50 text-foreground"
          });
          fetchUsers();
          setIsModalOpen(false);
        }
      } else {
        if (!userFormData.password) {
          toast.error("Password is required for credentials");
          return;
        }
        const { data } = await api.post("/users", userFormData);
        if (data.success) {
          toast.success("New member added to system", {
            className: "bg-background border-primary/50 text-foreground"
          });
          fetchUsers();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to revoke access for this user?")) return;
    try {
      const { data } = await api.delete(`/users/${userId}`);
      if (data.success) {
        toast.success("User access revoked");
        fetchUsers();
      }
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="theme-neon-blue">
      <Layout>
        <div className="space-y-10 pb-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase border-l-4 border-primary pl-4">USERS & ACCESS</h1>
              <p className="text-muted-foreground text-sm font-medium tracking-tight mt-1 ml-5">Manage identity and permissions across the RETAIL PRO network.</p>
            </div>
            <Button 
              onClick={handleOpenAddUser} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 rounded-2xl font-black gap-2 shadow-[0_0_20px_rgba(var(--primary),0.3)] uppercase tracking-tighter"
            >
              <UserPlus className="w-5 h-5" /> Add New Member
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card className="bg-card/40 backdrop-blur-xl border-primary/10 rounded-3xl p-6">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                      <Users className="w-6 h-6 text-primary" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Members</p>
                      <h3 className="text-2xl font-black tracking-tighter">{users.length}</h3>
                   </div>
                </div>
             </Card>
             <Card className="bg-card/40 backdrop-blur-xl border-primary/10 rounded-3xl p-6">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                      <Shield className="w-6 h-6 text-purple-400" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Admins</p>
                      <h3 className="text-2xl font-black tracking-tighter text-purple-400">{users.filter(u => u.role === 'Admin').length}</h3>
                   </div>
                </div>
             </Card>
             <Card className="bg-card/40 backdrop-blur-xl border-primary/10 rounded-3xl p-6">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">System Status</p>
                      <h3 className="text-2xl font-black tracking-tighter text-green-400 italic uppercase">Secure</h3>
                   </div>
                </div>
             </Card>
          </div>

          {/* Users Table */}
          <Card className="bg-card/30 backdrop-blur-xl rounded-[3rem] border border-primary/10 overflow-hidden">
            <div className="p-8 border-b border-primary/10 flex flex-col md:flex-row gap-6 justify-between items-center bg-white/5">
               <div className="relative flex-1 w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, email or ID..." 
                    className="pl-10 h-12 bg-black/20 border-primary/10 focus:border-primary/30 rounded-2xl font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <div className="flex gap-3">
                  <Button variant="ghost" className="rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px] border border-primary/10 hover:bg-primary/10">
                     <Filter className="w-4 h-4 mr-2" /> Filter
                  </Button>
                  <Button variant="ghost" className="rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px] border border-primary/10 hover:bg-primary/10" onClick={fetchUsers} disabled={isLoading}>
                     <History className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                  </Button>
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-black/20">
                  <TableRow className="border-b border-primary/5 hover:bg-transparent">
                    <TableHead className="py-5 px-8 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">MEMBER PROFILE</TableHead>
                    <TableHead className="py-5 px-8 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">LOGIN IDENTITY</TableHead>
                    <TableHead className="py-5 px-8 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">PERMISSION ROLE</TableHead>
                    <TableHead className="py-5 px-8 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">LAST ACTIVITY</TableHead>
                    <TableHead className="py-5 px-8 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground text-right pr-12">MANAGE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                  {isLoading ? (
                    [1,2,3,4,5].map(i => (
                      <TableRow key={i} className="animate-pulse border-primary/5">
                         <TableCell className="px-8"><div className="h-12 w-48 bg-primary/5 rounded-2xl" /></TableCell>
                         <TableCell><div className="h-4 w-40 bg-primary/5 rounded-lg" /></TableCell>
                         <TableCell><div className="h-6 w-24 bg-primary/5 rounded-full" /></TableCell>
                         <TableCell><div className="h-4 w-32 bg-primary/5 rounded-lg" /></TableCell>
                         <TableCell className="text-right pr-12"><div className="h-10 w-10 bg-primary/5 rounded-xl ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="h-80 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                           <div className="p-6 bg-primary/5 rounded-full ring-8 ring-primary/5">
                              <Search className="w-12 h-12 text-primary" />
                           </div>
                           <div>
                              <p className="text-lg font-black uppercase tracking-tighter">No Members Found</p>
                              <p className="text-xs font-medium">Try adjusting your search criteria or add a new member.</p>
                           </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.map((u, idx) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group border-b border-primary/5 last:border-0 hover:bg-primary/[0.03] transition-colors"
                    >
                      <TableCell className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className="relative group/avatar">
                             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 flex items-center justify-center font-black text-xl text-primary transition-transform group-hover/avatar:scale-110 shadow-lg">
                                {u.name[0]}
                             </div>
                             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-background shadow-lg" />
                          </div>
                          <div>
                            <p className="font-black text-sm tracking-tight text-foreground uppercase">{u.name}</p>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                               <Calendar className="w-2.5 h-2.5" />
                               <span className="text-[9px] font-bold uppercase tracking-widest">{new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-8 font-mono text-xs font-bold text-muted-foreground">
                         <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-primary/40" />
                            {u.email}
                         </div>
                      </TableCell>
                      <TableCell className="py-6 px-8">
                        <Badge className={`font-black text-[9px] uppercase tracking-widest border-none px-4 py-1.5 rounded-full ${
                          u.role === 'Admin' ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 
                          u.role === 'Manager' ? 'bg-primary text-white shadow-[0_0_15px_rgba(var(--primary),0.4)]' : 
                          'bg-slate-500 text-white shadow-[0_0_15px_rgba(100,116,139,0.4)]'
                        }`}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-6 px-8">
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-tight text-foreground">Online Now</span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">System ID: {u._id.slice(-6).toUpperCase()}</span>
                         </div>
                      </TableCell>
                      <TableCell className="py-6 px-8 text-right pr-12">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                 <MoreVertical className="w-5 h-5" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-xl border-primary/20 rounded-2xl overflow-hidden shadow-2xl p-2 w-48">
                              <DropdownMenuItem onClick={() => handleOpenEditUser(u)} className="rounded-xl px-4 py-2.5 gap-3 font-bold text-[10px] uppercase tracking-widest focus:bg-primary/10 focus:text-primary cursor-pointer mb-1">
                                 <Settings className="w-4 h-4" /> Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteUser(u._id)} className="rounded-xl px-4 py-2.5 gap-3 font-bold text-[10px] uppercase tracking-widest focus:bg-destructive/10 focus:text-destructive text-destructive/80 cursor-pointer">
                                 <X className="w-4 h-4" /> Revoke Access
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
            
            <div className="p-6 bg-white/5 border-t border-primary/5 flex justify-between items-center px-10">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Showing {filteredUsers.length} Active Database Records</p>
               <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
               </div>
            </div>
          </Card>
        </div>

        {/* User Form Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md bg-card/60 backdrop-blur-3xl border-primary/30 shadow-2xl rounded-[3rem] overflow-hidden p-0">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            <DialogHeader className="p-10 pb-0">
              <div className="flex items-center gap-4 mb-2">
                 <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                    <UserPlus className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                    <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic leading-none">
                      {editingUser ? "Edit Profile" : "New Access"}
                    </DialogTitle>
                    <DialogDescription className="font-bold text-muted-foreground text-xs mt-1">
                      Configure system permissions and security credentials.
                    </DialogDescription>
                 </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmitUser} className="space-y-6 p-10 pt-8">
               <div className="space-y-4">
                 <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Identity Name</Label>
                    <Input 
                      placeholder="e.g. Rahul Singh" 
                      className="h-14 rounded-2xl bg-black/40 border-primary/10 focus:border-primary/40 shadow-inner text-lg font-bold"
                      value={userFormData.name}
                      onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                      required
                    />
                 </div>
                 <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">System Email Address</Label>
                    <Input 
                      type="email"
                      placeholder="name@retailpro.system" 
                      className="h-14 rounded-2xl bg-black/40 border-primary/10 focus:border-primary/40 shadow-inner font-bold"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                      required
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Level</Label>
                       <Select 
                         value={userFormData.role} 
                         onValueChange={(val) => setUserFormData({...userFormData, role: val})}
                       >
                         <SelectTrigger className="h-14 rounded-2xl bg-black/40 border-primary/10 shadow-inner font-bold">
                            <SelectValue placeholder="Select" />
                         </SelectTrigger>
                         <SelectContent className="rounded-2xl border-primary/20 bg-card/95 backdrop-blur-xl">
                            <SelectItem value="Admin" className="font-bold">ADMIN [CORE]</SelectItem>
                            <SelectItem value="Manager" className="font-bold">MANAGER</SelectItem>
                            <SelectItem value="Cashier" className="font-bold">CASHIER</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-1.5">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                          {editingUser ? "Reset Password" : "Secure Password"}
                       </Label>
                       <Input 
                         type="password"
                         placeholder="••••••••" 
                         className="h-14 rounded-2xl bg-black/40 border-primary/10 shadow-inner font-bold"
                         value={userFormData.password}
                         onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                         required={!editingUser}
                       />
                    </div>
                 </div>
               </div>

               <DialogFooter className="pt-8 gap-3">
                  <Button type="button" variant="ghost" className="h-16 font-black rounded-2xl px-8 uppercase tracking-widest text-xs" onClick={() => setIsModalOpen(false)}>Abort</Button>
                  <Button type="submit" className="h-16 font-black rounded-2xl px-10 shadow-xl shadow-primary/20 flex-1 uppercase tracking-tighter text-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                     {editingUser ? "Update Database" : "Enable Access"}
                  </Button>
               </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Layout>
    </div>
  );
}
