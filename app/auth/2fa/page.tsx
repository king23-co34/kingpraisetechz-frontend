"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Smartphone, CheckCircle2, Crown, RefreshCw, Copy } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import toast from "react-hot-toast";

export default function TwoFactorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSetup = searchParams.get("setup") === "true";
  const { verify2FA, user, isLoading } = useAuthStore();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [setupStep, setSetupStep] = useState<1 | 2>(1);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isSetup) {
      // Fetch QR code for setup
      apiClient.post("/auth/setup-2fa")
        .then((res) => {
          setQrCode(res.data.qrCode);
          setSecret(res.data.secret);
        })
        .catch(() => toast.error("Failed to initialize 2FA setup"));
    }
  }, [isSetup]);

  const handleInput = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste handling
      const chars = value.slice(0, 6).split("");
      const newCode = [...code];
      chars.forEach((char, i) => {
        if (index + i < 6) newCode[index + i] = char;
      });
      setCode(newCode);
      inputRefs.current[Math.min(index + chars.length, 5)]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) return;

    try {
      if (isSetup) {
        // Enable 2FA
        await apiClient.post("/auth/enable-2fa", { code: fullCode });
        toast.success("2FA enabled successfully!");
        if (user) {
          router.push(`/dashboard/${user.role}`);
        } else {
          router.push("/auth/login");
        }
      } else {
        await verify2FA(fullCode);
        const { user: currentUser } = useAuthStore.getState();
        if (currentUser) {
          router.push(`/dashboard/${currentUser.role}`);
        }
      }
    } catch {
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    toast.success("Secret copied to clipboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(26,77,255,0.08) 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl btn-glow flex items-center justify-center">
           <Image src={Logo} alt="Logo" width={60} height={60} />
          </div>
          <span className="font-display font-bold text-xl text-white">King Praise Techz</span>
        </div>

        <div className="glass-card p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center" style={{ boxShadow: "0 0 30px rgba(26,77,255,0.3)" }}>
              <Shield size={28} className="text-brand-400" />
            </div>
          </div>

          {isSetup ? (
            <>
              {/* Setup flow */}
              <div className="flex items-center gap-1.5 justify-center mb-6">
                <div className={cn("step-dot", setupStep >= 1 ? "active" : "")} />
                <div className={cn("step-dot", setupStep >= 2 ? "active" : "")} />
              </div>

              {setupStep === 1 ? (
                <>
                  <h2 className="font-display font-bold text-2xl text-white text-center mb-2">
                    Set up Two-Factor Auth
                  </h2>
                  <p className="text-slate-400 text-sm text-center mb-6">
                    Scan this QR code with Google Authenticator to secure your account
                  </p>

                  {/* QR Code */}
                  <div className="flex justify-center mb-6">
                    {qrCode ? (
                      <div className="p-4 bg-white rounded-2xl">
                        <img src={qrCode} alt="2FA QR Code" className="w-40 h-40" />
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Steps */}
                  <div className="space-y-3 mb-6">
                    {[
                      "Install Google Authenticator on your phone",
                      "Open the app and tap the '+' button",
                      "Select 'Scan QR code' and scan the code above",
                    ].map((instruction, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400 shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-slate-300 text-sm">{instruction}</p>
                      </div>
                    ))}
                  </div>

                  {/* Manual entry */}
                  {secret && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-6">
                      <p className="text-xs text-slate-400 mb-2">Can't scan? Enter this code manually:</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-brand-400 flex-1 break-all">{secret}</code>
                        <button onClick={copySecret} className="text-slate-400 hover:text-white transition-colors shrink-0">
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSetupStep(2)}
                    className="w-full py-3.5 rounded-xl font-semibold text-white btn-glow flex items-center justify-center gap-2"
                  >
                    I've scanned the code
                    <Smartphone size={16} />
                  </motion.button>
                </>
              ) : (
                <>
                  <h2 className="font-display font-bold text-2xl text-white text-center mb-2">
                    Verify Setup
                  </h2>
                  <p className="text-slate-400 text-sm text-center mb-8">
                    Enter the 6-digit code from Google Authenticator to confirm
                  </p>

                  {/* OTP Input */}
                  <div className="flex justify-center gap-3 mb-8">
                    {code.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { inputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleInput(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className={cn(
                          "w-11 h-14 text-center text-xl font-bold rounded-xl border transition-all",
                          "input-dark",
                          digit ? "border-brand-500/50 text-brand-300" : "border-white/10"
                        )}
                      />
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleVerify}
                    disabled={isLoading || code.join("").length !== 6}
                    className="w-full py-3.5 rounded-xl font-semibold text-white btn-glow flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><CheckCircle2 size={16} />Verify & Enable 2FA</>
                    )}
                  </motion.button>

                  <button onClick={() => setSetupStep(1)} className="w-full mt-3 text-sm text-slate-400 hover:text-white transition-colors py-2">
                    ← Back to QR code
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {/* Verify flow */}
              <h2 className="font-display font-bold text-2xl text-white text-center mb-2">
                Two-Factor Authentication
              </h2>
              <p className="text-slate-400 text-sm text-center mb-8">
                Enter the 6-digit code from your Google Authenticator app
              </p>

              <div className="flex justify-center gap-3 mb-8">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleInput(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={cn(
                      "w-11 h-14 text-center text-xl font-bold rounded-xl border transition-all",
                      "input-dark",
                      digit ? "border-brand-500/50 text-brand-300" : "border-white/10"
                    )}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleVerify}
                disabled={isLoading || code.join("").length !== 6}
                className="w-full py-3.5 rounded-xl font-semibold text-white btn-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Shield size={16} />Verify Identity</>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-2 mt-4">
                <RefreshCw size={14} className="text-slate-500" />
                <p className="text-sm text-slate-400">
                  Code refreshes every 30 seconds
                </p>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Having trouble?{" "}
          <a href="mailto:chibuksai@gmail.com" className="text-brand-400 hover:text-brand-300 transition-colors">
            Contact support
          </a>
        </p>
      </motion.div>
    </div>
  );
}
