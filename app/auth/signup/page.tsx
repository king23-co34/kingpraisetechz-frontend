"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import Logo from "@/assets/logo.png";
import {
 Shield, Eye, EyeOff, ArrowRight, ArrowLeft, Zap, Users, CheckCircle2, Crown,
  Building2, Phone, Code, Palette, Globe, Database, LayoutDashboard, MessageSquare
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

  const handleNext = () => {
    if (step < totalSteps) setStep((prev) => (prev + 1) as any);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    }
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      return;
    }
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
      // Error handled in store
    }
  };

  const canProceedStep2 = formData.name && formData.email && formData.password &&
    formData.password === formData.confirmPassword && formData.password.length >= 8;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-between p-12">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 30% 40%, rgba(26,77,255,0.2) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(16,185,129,0.1) 0%, transparent 50%)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/2 w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(26,77,255,0.08) 0%, transparent 70%)", transform: "translate(-50%, -50%)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl btn-glow flex items-center justify-center">
              <Image src={Logo} alt="Logo" width={60} height={60} />
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
            {[
              "Choose your role",
              "Create your account",
              selectedRole === "team" ? "Your skills" : "Company details",
              "Secure with 2FA",
            ].map((stepLabel, idx) => (
              <div key={idx} className={cn("flex items-center gap-3 transition-all", idx < step - 1 ? "opacity-100" : idx === step - 1 ? "opacity-100" : "opacity-30")}>
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-all",
                  idx < step - 1 ? "bg-emerald-500 border-emerald-500 text-white" :
                    idx === step - 1 ? "bg-brand-500 border-brand-500 text-white" :
                      "border-white/20 text-slate-500"
                )}>
                  {idx < step - 1 ? <CheckCircle2 size={14} /> : idx + 1}
                </div>
                <span className={cn("text-sm font-medium", idx === step - 1 ? "text-white" : idx < step - 1 ? "text-emerald-400" : "text-slate-500")}>
                  {stepLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-600 text-xs">
          © 2024 King Praise Techz. All rights reserved.
        </div>
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
              <div
                key={idx}
                className={cn("step-dot", idx < step ? "completed" : "", idx === step - 1 ? "active" : "")}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Role Selection */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display font-bold text-3xl text-white mb-2">Create account</h2>
                <p className="text-slate-400 mb-8">How are you joining us today?</p>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleRoleSelect("client")}
                    className="w-full glass-card p-6 text-left border border-white/5 hover:border-brand-500/40 transition-all group card-hover"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                        <Zap size={22} className="text-brand-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-bold text-white text-lg">I'm a Client</p>
                        <p className="text-slate-400 text-sm mt-1">I want to hire King Praise Techz for a project and track its progress</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {["Project Tracking", "Milestones", "Reviews"].map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-slate-500 mt-1 group-hover:text-brand-400 transition-colors" />
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleRoleSelect("team")}
                    className="w-full glass-card p-6 text-left border border-white/5 hover:border-emerald-500/40 transition-all group card-hover"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                        <Users size={22} className="text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-bold text-white text-lg">I'm a Team Member</p>
                        <p className="text-slate-400 text-sm mt-1">I'm part of the KPT team and want to manage my tasks and projects</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {["Task Management", "Payments", "Deliverables"].map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-slate-500 mt-1 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </motion.button>
                </div>

                <div className="text-center mt-8">
                  <p className="text-slate-400 text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                      Sign in
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Account Details */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={handleBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
                  <ArrowLeft size={16} />Back
                </button>

                <div className="flex items-center gap-2 mb-6">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", selectedRole === "client" ? "bg-brand-500/20" : "bg-emerald-500/20")}>
                    {selectedRole === "client" ? <Zap size={16} className="text-brand-400" /> : <Users size={16} className="text-emerald-400" />}
                  </div>
                  <span className={cn("text-sm font-medium capitalize", selectedRole === "client" ? "text-brand-400" : "text-emerald-400")}>
                    {selectedRole} account
                  </span>
                </div>

                <h2 className="font-display font-bold text-3xl text-white mb-2">Your details</h2>
                <p className="text-slate-400 mb-6">Tell us a bit about yourself</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Adeyemi"
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Min. 8 characters"
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm pr-12"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {/* Password strength */}
                    {formData.password && (
                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div key={level} className={cn("h-1 flex-1 rounded-full transition-all", formData.password.length >= level * 2 + 2 ? level <= 2 ? "bg-red-500" : level === 3 ? "bg-yellow-500" : "bg-emerald-500" : "bg-white/10")} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className={cn("input-dark w-full px-4 py-3 rounded-xl text-sm pr-12 transition-all", formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-red-500/50" : formData.confirmPassword && formData.password === formData.confirmPassword ? "border-emerald-500/50" : "")}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleNext}
                  disabled={!canProceedStep2}
                  className={cn("w-full mt-6 py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all", "btn-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none")}
                >
                  Continue <ArrowRight size={16} />
                </motion.button>
              </motion.div>
            )}

            {/* Step 3: Role-specific details */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={handleBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
                  <ArrowLeft size={16} />Back
                </button>

                {selectedRole === "client" ? (
                  <>
                    <h2 className="font-display font-bold text-3xl text-white mb-2">Company info</h2>
                    <p className="text-slate-400 mb-6">Optional but helps us serve you better</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 block mb-2">Company / Brand Name</label>
                        <div className="relative">
                          <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="Acme Corp (optional)"
                            className="input-dark w-full px-4 py-3 rounded-xl text-sm pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 block mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+234 000 000 0000 (optional)"
                            className="input-dark w-full px-4 py-3 rounded-xl text-sm pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="font-display font-bold text-3xl text-white mb-2">Your skills</h2>
                    <p className="text-slate-400 mb-6">Select all that apply to you</p>
                    <div className="grid grid-cols-2 gap-3">
                      {skillOptions.map((skill) => (
                        <motion.button
                          key={skill.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleSkill(skill.id)}
                          className={cn(
                            "p-3 rounded-xl border flex items-center gap-2 text-sm font-medium transition-all",
                            selectedSkills.includes(skill.id)
                              ? "bg-brand-500/20 border-brand-500/50 text-brand-300"
                              : "glass-card border-white/5 text-slate-400 hover:border-white/15 hover:text-white"
                          )}
                        >
                          <span className={selectedSkills.includes(skill.id) ? "text-brand-400" : "text-slate-500"}>{skill.icon}</span>
                          {skill.label}
                          {selectedSkills.includes(skill.id) && <CheckCircle2 size={14} className="ml-auto text-brand-400" />}
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={selectedRole === "team" ? handleNext : handleSignup}
                  disabled={isLoading}
                  className="w-full mt-6 py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 btn-glow disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{selectedRole === "team" ? "Continue" : "Create Account"} <ArrowRight size={16} /></>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* Step 4: Team final review */}
            {step === 4 && selectedRole === "team" && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={handleBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
                  <ArrowLeft size={16} />Back
                </button>
                <h2 className="font-display font-bold text-3xl text-white mb-2">Almost there!</h2>
                <p className="text-slate-400 mb-6">Review your information</p>

                <div className="space-y-3 mb-6">
                  {[
                    { label: "Name", value: formData.name },
                    { label: "Email", value: formData.email },
                    { label: "Role", value: "Team Member" },
                    { label: "Skills", value: selectedSkills.length > 0 ? selectedSkills.map(s => skillOptions.find(o => o.id === s)?.label).join(", ") : "None selected" },
                  ].map((item) => (
                    <div key={item.label} className="glass-card p-4 flex justify-between items-center">
                      <span className="text-slate-400 text-sm">{item.label}</span>
                      <span className="text-white text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-500/5 border border-brand-500/20 mb-6">
                  <Shield size={16} className="text-brand-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    After creating your account, you'll be guided to set up Google Authenticator for Two-Factor Authentication to keep your account secure.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSignup}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 btn-glow disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight size={16} /></>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
