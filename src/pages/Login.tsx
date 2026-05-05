import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.webp';

interface LoginProps {
  onLogin: () => void;
}

const features = [
  { icon: TrendingUp, label: 'Market Intelligence', desc: 'Real-time talent trends' },
  { icon: Users, label: 'Workforce Analytics', desc: 'Employee insights' },
  { icon: BarChart3, label: 'Skill Requirement Analysis', desc: 'Data-driven decisions' },
];

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('admin@hrbp.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to HRBP Demand Sensing Platform"
      });
      onLogin();
      navigate('/market-sensing');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-chart-2">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-chart-2/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>


        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 p-2">
                <img src={logo} alt="HRBP Demand Sensing Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">HRBP Demand Sensing</h2>
                <p className="text-white/60 text-sm">Workforce Analytics Platform</p>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-4 max-w-md">
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Transform Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-200">
                  Workforce Strategy
                </span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed">
                Leverage AI-powered insights to make data-driven decisions about talent acquisition, development, and retention.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {features.map((feature, i) => (
                <div 
                  key={feature.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{feature.label}</p>
                    <p className="text-white/50 text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card shadow-lg mb-4 p-2">
              <img src={logo} alt="HRBP Demand Sensing Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">HRBP Demand Sensing</h1>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-accent text-sm font-medium">Welcome back</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Sign in to your account</h2>
            <p className="text-muted-foreground">Access your workforce analytics dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <div className={cn(
                "relative rounded-xl border-2 transition-all duration-300",
                focusedField === 'email' ? 'border-accent shadow-lg shadow-accent/10' : 'border-border'
              )}>
                <Mail className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300",
                  focusedField === 'email' ? 'text-accent' : 'text-muted-foreground'
                )} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="pl-12 h-12 border-0 bg-transparent focus-visible:ring-0 text-base"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <button 
                  type="button"
                  className="text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className={cn(
                "relative rounded-xl border-2 transition-all duration-300",
                focusedField === 'password' ? 'border-accent shadow-lg shadow-accent/10' : 'border-border'
              )}>
                <Lock className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300",
                  focusedField === 'password' ? 'text-accent' : 'text-muted-foreground'
                )} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="pl-12 pr-12 h-12 border-0 bg-transparent focus-visible:ring-0 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id="remember"
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded-md border-2 border-border peer-checked:border-accent peer-checked:bg-accent transition-all duration-200 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <label htmlFor="remember" className="absolute inset-0 cursor-pointer" />
              </div>
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                Keep me signed in for 30 days
              </Label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className={cn(
                "w-full h-12 text-base font-semibold rounded-xl gap-2 transition-all duration-300",
                "bg-gradient-to-r from-primary to-primary/90 hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02]",
                isLoading && "pointer-events-none"
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  Sign in to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm text-muted-foreground">Demo Access</span>
            </div>
          </div>

          {/* Demo Info */}
          <div className="text-center p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Try it out:</span> Enter any email and password to explore the platform
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            © 2024 HRBP Demand Sensing Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
