import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User as UserIcon, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { ROUTE_PATHS, UserRole } from "@/lib/index";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth() as any; // We'll add this to useAuth
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Cashier" as UserRole,
  });

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate(ROUTE_PATHS.DASHBOARD);
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await signup(formData);
      if (res.success) {
        toast.success("Account created successfully!");
        // The signup function in useAuth handles navigation upon success
      } else {
        toast.error(res.error || "Failed to create account");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden shadow-blue-900/20">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
              <p className="text-slate-400 mt-2 font-medium">Join POS Pro to streamline your retail flow</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input 
                    placeholder="John Doe"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 h-12 bg-slate-950/50 border-slate-700/50 focus:border-blue-500 text-white rounded-xl shadow-inner focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input 
                    placeholder="name@company.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12 bg-slate-950/50 border-slate-700/50 focus:border-blue-500 text-white rounded-xl shadow-inner focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 h-12 bg-slate-950/50 border-slate-700/50 focus:border-blue-500 text-white rounded-xl shadow-inner focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Role</label>
                <select 
                  value={formData.role} 
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full h-12 bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 text-white rounded-xl shadow-inner focus:ring-1 focus:ring-blue-500 transition-all font-medium px-4 outline-none"
                >
                  <option value="Cashier" className="bg-slate-900 text-white text-base">Cashier</option>
                  <option value="Manager" className="bg-slate-900 text-white text-base">Manager</option>
                  <option value="Admin" className="bg-slate-900 text-white text-base">Admin</option>
                </select>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 text-base mt-4 transition-all group"
              >
                {loading ? "Creating Account..." : (
                  <>
                    Sign Up
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-center flex items-center justify-center gap-2">
            <span className="text-slate-400 text-sm font-medium">Already have an account?</span>
            <button 
              onClick={() => navigate(ROUTE_PATHS.LOGIN)}
              className="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center gap-1 transition-colors"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
