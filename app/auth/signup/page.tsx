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

// =========================
// RoleCard Component (Moved above SignupPage)
// =========================
function RoleCard({
  role,
  label,
  description,
  tags,
  icon,
  color,
  onClick,
}: {
  role: string;
  label: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "w-full glass-card p-6 text-left border border-white/5 hover:border-" +
          color +
          "-500/40 transition-all group card-hover"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            `bg-${color}-500/10 group-hover:bg-${color}-500/20`
          )}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-white text-lg">{label}</p>
          <p className="text-slate-400 text-sm mt-1">{description}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "text-xs px-2 py-1 rounded-md",
                  `bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <ArrowRight
          size={16}
          className={cn(
            "text-slate-500 mt-1 group-hover:text-" + color + "-400 transition-colors"
          )}
        />
      </div>
    </motion.button>
  );
}

// =========================
// SignupPage Component
// =========================
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
        {/* ...Your existing left panel code remains unchanged... */}
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          {/* ...existing mobile logo code... */}

          {/* Step indicators */}
          {/* ...existing step indicator code... */}

          <AnimatePresence mode="wait">
            {step === 1 && <Step1 handleRoleSelect={handleRoleSelect} />}
            {step === 2 && (
              <Step2
                formData={formData}
                setFormData={setFormData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                selectedRole={selectedRole}
                handleNext={handleNext}
                canProceedStep2={canProceedStep2}
                handleBack={handleBack}
              />
            )}
            {step === 3 && (
              <Step3
                selectedRole={selectedRole}
                formData={formData}
                setFormData={setFormData}
                toggleSkill={toggleSkill}
                selectedSkills={selectedSkills}
                handleNext={handleNext}
                handleSignup={handleSignup}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                setShowPassword={setShowPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                isLoading={isLoading}
                handleBack={handleBack}
              />
            )}
            {step === 4 && selectedRole === "team" && (
              <Step4
                formData={formData}
                selectedSkills={selectedSkills}
                handleSignup={handleSignup}
                isLoading={isLoading}
                handleBack={handleBack}
              />
            )}
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
    </motion.div>
  );
}

function Step2({ formData, setFormData, showPassword, setShowPassword, selectedRole, handleNext, canProceedStep2, handleBack }: any) {
  return (
    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="font-display font-bold text-3xl text-white mb-2">Your Account Details</h2>
      <p className="text-slate-400 mb-8">Fill in your information to continue</p>
      <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" />
      <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input mt-2" />
      <div className="flex gap-2 mt-4">
        <button disabled={!canProceedStep2} onClick={handleNext} className="btn btn-primary flex-1">Next</button>
        <button onClick={handleBack} className="btn btn-secondary flex-1">Back</button>
      </div>
    </motion.div>
  );
}

function Step3({ selectedRole, formData, setFormData, toggleSkill, selectedSkills, handleNext, handleSignup, showPassword, showConfirmPassword, setShowPassword, setShowConfirmPassword, isLoading, handleBack }: any) {
  return (
    <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="font-display font-bold text-3xl text-white mb-2">Your Skills / Details</h2>
      <p className="text-slate-400 mb-8">Select your skills or fill company details</p>
      {selectedRole === "team" ? (
        <div className="flex flex-wrap gap-2">
          {skillOptions.map((skill) => (
            <button key={skill.id} className={cn("px-3 py-1 rounded-md", selectedSkills.includes(skill.id) ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300")} onClick={() => toggleSkill(skill.id)}>
              {skill.label}
            </button>
          ))}
        </div>
      ) : (
        <input type="text" placeholder="Company Name" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="input" />
      )}
      <div className="flex gap-2 mt-4">
        <button onClick={handleNext} className="btn btn-primary flex-1">Next</button>
        <button onClick={handleBack} className="btn btn-secondary flex-1">Back</button>
      </div>
    </motion.div>
  );
}

function Step4({ formData, selectedSkills, handleSignup, isLoading, handleBack }: any) {
  return (
    <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="font-display font-bold text-3xl text-white mb-2">Confirm & Signup</h2>
      <p className="text-slate-400 mb-8">You're almost done!</p>
      <div className="flex gap-2 mt-4">
        <button onClick={handleSignup} className="btn btn-primary flex-1" disabled={isLoading}>{isLoading ? "Signing up..." : "Signup"}</button>
        <button onClick={handleBack} className="btn btn-secondary flex-1">Back</button>
      </div>
    </motion.div>
  );
}