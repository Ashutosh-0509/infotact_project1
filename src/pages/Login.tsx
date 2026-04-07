import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole, ROUTE_PATHS } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const springPreset = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 35,
};

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: springPreset,
};

const roles: { value: UserRole; label: string; description: string }[] = [
  { value: 'Admin', label: 'Administrator', description: 'Full system access' },
  { value: 'Manager', label: 'Manager', description: 'Manage operations' },
  { value: 'Staff', label: 'Staff', description: 'POS and basic tasks' },
];

const demoCredentials = [
  { email: 'admin@pos.com', password: 'admin123', role: 'Admin' as UserRole },
  { email: 'manager@pos.com', password: 'manager123', role: 'Manager' as UserRole },
  { email: 'staff@pos.com', password: 'staff123', role: 'Staff' as UserRole },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Staff');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    navigate(ROUTE_PATHS.DASHBOARD);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password || !role) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login({ email, password, role });

    if (!result.success) {
      setError(result.error || 'Login failed');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (credentials: typeof demoCredentials[0]) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
    setRole(credentials.role);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springPreset}
      >
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
              {...fadeInUp}
            >
              <LogIn className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.div {...fadeInUp} transition={{ ...springPreset, delay: 0.1 }}>
              <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-base mt-2">
                Sign in to your POS account
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springPreset}
              >
                <Alert variant="destructive" className="border-destructive/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                className="space-y-2"
                {...fadeInUp}
                transition={{ ...springPreset, delay: 0.2 }}
              >
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@pos.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                className="space-y-2"
                {...fadeInUp}
                transition={{ ...springPreset, delay: 0.25 }}
              >
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="space-y-2"
                {...fadeInUp}
                transition={{ ...springPreset, delay: 0.3 }}
              >
                <Label htmlFor="role" className="text-sm font-medium">
                  Role
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                    <SelectTrigger className="pl-10 h-11">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{r.label}</span>
                            <span className="text-xs text-muted-foreground">{r.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-2"
                {...fadeInUp}
                transition={{ ...springPreset, delay: 0.35 }}
              >
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer select-none"
                >
                  Remember me for 30 days
                </Label>
              </motion.div>

              <motion.div {...fadeInUp} transition={{ ...springPreset, delay: 0.4 }}>
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              className="pt-4 border-t border-border/50"
              {...fadeInUp}
              transition={{ ...springPreset, delay: 0.45 }}
            >
              <p className="text-sm text-muted-foreground text-center mb-3">
                Demo Credentials
              </p>
              <div className="grid gap-2">
                {demoCredentials.map((cred, index) => (
                  <motion.button
                    key={cred.email}
                    onClick={() => handleDemoLogin(cred)}
                    className="w-full px-4 py-2.5 text-left rounded-lg border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springPreset, delay: 0.5 + index * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">
                          {cred.role}
                        </p>
                        <p className="text-xs text-muted-foreground">{cred.email}</p>
                      </div>
                      <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        Click to fill
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </CardContent>
        </Card>

        <motion.p
          className="text-center text-sm text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...springPreset, delay: 0.7 }}
        >
          © 2026 POS & Inventory System. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}
