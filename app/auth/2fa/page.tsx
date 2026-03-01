"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Smartphone, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import toast from "react-hot-toast";

export default function TwoFactorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSetup = searchParams?.get("setup") === "true";

  const { verify2FA, user, isLoading } = useAuthStore();

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [setupStep, setSetupStep] = useState<1 | 2>(1);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Only run client-side setup
  useEffect(() => {
    if (isSetup) {
      apiClient
        .post("/auth/2fa/setup")
        .then((res) => {
          setQrCode(res.data.qrCode);
          setSecret(res.data.secret);
          setSetupStep(2);
        })
        .catch(() => toast.error("Failed to initialize 2FA setup"));
    } else {
      setSetupStep(2); // just show input for normal verification
    }
  }, [isSetup]);

  const handleInput = (index: number, value: string) => {
    const newCode = [...code];

    if (value.length > 1) {
      value
        .slice(0, 6)
        .split("")
        .forEach((char, i) => {
          if (index + i < 6) newCode[index + i] = char;
        });

      setCode(newCode);
      inputRefs.current[Math.min(index + value.length, 5)]?.focus();
      return;
    }

    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) return;

    try {
      if (isSetup) {
        await apiClient.post("/auth/enable-2fa", { code: fullCode });
        toast.success("2FA enabled successfully!");
        router.push(user ? `/dashboard/${user.role}` : "/auth/login");
      } else {
        await verify2FA(fullCode);
        const { user: currentUser } = useAuthStore.getState();
        if (currentUser) router.push(`/dashboard/${currentUser.role}`);
      }
    } catch {
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      toast.error("Invalid 2FA code");
    }
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      toast.success("Secret copied to clipboard");
    } catch {
      toast.error("Failed to copy secret");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(26,77,255,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)" }}
        />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl btn-glow flex items-center justify-center">
            <Image src={Logo} alt="Logo" width={60} height={60} />
          </div>
          <span className="font-display font-bold text-xl text-white">King Praise Techz</span>
        </div>

        <div className="glass-card p-8">
          <div className="flex justify-center gap-3 mb-8">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el!;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
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

          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full py-3.5 mt-4 rounded-xl font-semibold text-white btn-glow disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}