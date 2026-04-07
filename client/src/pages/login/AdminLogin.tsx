import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, EyeOff, Eye, ArrowLeft, Loader2, AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { ROUTE_PATHS } from '@/lib/index';

const springPreset = {
  type: 'spring',
  stiffness: 300,
  damping: 35,
};

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: springPreset,
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login({ email, password, role: 'Admin' });
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin@pos.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 lg:p-24 relative overflow-hidden" 
           style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}>
        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={springPreset}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8"
          >
            <ShieldCheck className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 
            {...fadeInUp}
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Admin Console
          </motion.h1>
          <motion.p 
            {...fadeInUp} transition={{ ...springPreset, delay: 0.1 }}
            className="text-purple-100 text-lg lg:text-xl max-w-md leading-relaxed"
          >
            Centralized control panel for analytics, finance, and system configuration
          </motion.p>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] aspect-square rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-24 relative bg-white">
        <Link 
          to={ROUTE_PATHS.HOME} 
          className="absolute top-8 left-8 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Role Selection
        </Link>

        <motion.div 
          className="max-w-md w-full mx-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springPreset}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold" style={{ color: '#7c3aed' }}>System Login</h2>
            <p className="text-muted-foreground mt-2">Authorized Personnel Only.</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Admin ID or Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter email or ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-base font-medium rounded-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#7c3aed', color: 'white' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Accessing...
                  </>
                ) : (
                  'Access Console'
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-center mt-4 text-xs font-medium text-muted-foreground">
              <Lock className="w-3 h-3 mr-1" />
              🔒 Secure System
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm font-medium text-muted-foreground mb-3 text-center">Demo Credentials</p>
            <button
              onClick={fillDemo}
              className="w-full p-4 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-50 transition-colors text-left flex justify-between items-center group"
            >
              <div>
                <p className="text-sm font-semibold text-purple-900">Admin</p>
                <p className="text-xs text-purple-600/80 mt-1">admin@pos.com / admin123</p>
              </div>
              <span className="text-xs font-medium text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to fill
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
