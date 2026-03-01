"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Zap,
  Users,
  CheckCircle2,
  Crown,
  Building2,
  Phone,
  Code,
  Palette,
  Globe,
  Database,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";

type SignupRole = "client" | "team";

const skillOptions = [
  { id: "frontend", label: "Frontend Dev", icon: <Code size={14} /> },
  { id: "backend", label: "Backend Dev", icon: <Database size={14} /> },
  { id: "design", label: "UI/UX Design", icon: <Palette size={14} /> },
  { id: "mobile", label: "Mobile Dev", icon: <Phone size={14} /> },
  { id: "devops", label: "DevOps", icon: <Globe size={14} /> },
  { id: "pm", label: "Project Mgmt", icon: <LayoutDashboard size={14} /> },
  { id: "seo", label: "SEO", icon: <Globe size={14} /> },
  { id: "content", label: "Content", icon: <MessageSquare size={14} /> },
];

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<SignupRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    phone: "",
  });

  const totalSteps = selectedRole === "team" ? 4 : 3;

  const handleRoleSelect = (role: SignupRole) => {
    setSelectedRole(role);
    setStep(2);
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId) ? prev.filter((s) => s !== skillId) : [...prev, skillId]
    );
  };

  const handleNext = () => step < totalSteps && setStep((prev) => prev + 1);
  const handleBack = () => step > 1 && setStep((prev) => prev - 1);

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) return;

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole!,
        company: formData.company,
        phone: formData.phone,
        skills: selectedSkills,
      });
      router.push("/auth/2fa?setup=true");
    } catch {
      // error handled in store
    }
  };

  const canProceedStep2 =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.password === formData.confirmPassword &&
    formData.password.length >= 8;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-between p-12">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(26,77,255,0.2) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(16,185,129,0.1) 0%, transparent 50%)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
        <div className="absolute top-1/4 left-1/2 w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(26,77,255,0.08) 0%, transparent 70%)", transform: "translate(-50%, -50%)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl btn-glow flex items-center justify-center">
              <Crown size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">King Praise Techz</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="font-display font-bold text-4xl leading-tight text-white">
            Join the future<br />
            of <span className="gradient-text">web excellence</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Whether you're a client seeking amazing digital solutions or a talented professional, King Praise Techz is where great work happens.
          </p>

          {/* Progress steps visual */}
          <div className="space-y-3">
            {["Choose your role", "Create your account", selectedRole === "team" ? "Your skills" : "Company details", "Secure with 2FA"].map((label, idx) => (
              <div key={idx} className={cn("flex items-center gap-3 transition-all", idx < step - 1 ? "opacity-100" : idx === step - 1 ? "opacity-100" : "opacity-30")}>
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-all",
                  idx < step - 1 ? "bg-emerald-500 border-emerald-500 text-white" : idx === step - 1 ? "bg-brand-500 border-brand-500 text-white" : "border-white/20 text-slate-500"
                )}>
                  {idx < step - 1 ? <CheckCircle2 size={14} /> : idx + 1}
                </div>
                <span className={cn("text-sm font-medium", idx === step - 1 ? "text-white" : idx < step - 1 ? "text-emerald-400" : "text-slate-500")}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-600 text-xs">© 2024 King Praise Techz. All rights reserved.</div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 rounded-lg btn-glow flex items-center justify-center">
              <Crown size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">King Praise Techz</span>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-1.5 mb-8">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div key={idx} className={cn("step-dot", idx < step ? "completed" : "", idx === step - 1 ? "active" : "")} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Steps */}
            {step === 1 && <Step1 handleRoleSelect={handleRoleSelect} />}
            {step === 2 && <Step2 formData={formData} setFormData={setFormData} showPassword={showPassword} setShowPassword={setShowPassword} selectedRole={selectedRole} handleNext={handleNext} canProceedStep2={canProceedStep2} handleBack={handleBack} />}
            {step === 3 && <Step3 selectedRole={selectedRole} formData={formData} setFormData={setFormData} toggleSkill={toggleSkill} selectedSkills={selectedSkills} handleNext={handleNext} handleSignup={handleSignup} showPassword={showPassword} showConfirmPassword={showConfirmPassword} setShowPassword={setShowPassword} setShowConfirmPassword={setShowConfirmPassword} isLoading={isLoading} handleBack={handleBack} />}
            {step === 4 && selectedRole === "team" && <Step4 formData={formData} selectedSkills={selectedSkills} handleSignup={handleSignup} isLoading={isLoading} handleBack={handleBack} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// =========================
// Step Components
// =========================

function Step1({ handleRoleSelect }: { handleRoleSelect: (role: SignupRole) => void }) {
  return (
    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="font-display font-bold text-3xl text-white mb-2">Create account</h2>
      <p className="text-slate-400 mb-8">How are you joining us today?</p>
      <div className="space-y-4">
        <RoleCard role="client" label="I'm a Client" description="I want to hire King Praise Techz for a project and track its progress" tags={["Project Tracking", "Milestones", "Reviews"]} icon={<Zap size={22} />} color="brand" onClick={() => handleRoleSelect("client")} />
        <RoleCard role="team" label="I'm a Team Member" description="I'm part of the KPT team and want to manage my tasks and projects" tags={["Task Management", "Payments", "Deliverables"]} icon={<Users size={22} />} color="emerald" onClick={() => handleRoleSelect("team")} />
      </div>

      <div className="text-center mt-8">
        <p className="text-slate-400 text-sm">
          Already have an account? <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
}

function RoleCard({ role, label, description, tags, icon, color, onClick }: any) {
  return (
    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={onClick} className={cn("w-full glass-card p-6 text-left border border-white/5 hover:border-" + color + "-500/40 transition-all group card-hover")}>
      <div className="flex items-start gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", `bg-${color}-500/10 group-hover:bg-${color}-500/20`)}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-white text-lg">{label}</p>
          <p className="text-slate-400 text-sm mt-1">{description}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {tags.map((tag: string) => <span key={tag} className={cn("text-xs px-2 py-1 rounded-md", `bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`)}>{tag}</span>)}
          </div>
        </div>
        <ArrowRight size={16} className={cn("text-slate-500 mt-1 group-hover:text-" + color + "-400 transition-colors")} />
      </div>
    </motion.button>
  );
}