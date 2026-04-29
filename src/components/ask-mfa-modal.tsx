import { useState, useEffect } from "react";
import { X, KeyRound, Smartphone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AskMFAModalProps {
  customerName: string;
  onClose: () => void;
  onSuccess: () => void;
  onBlocked: () => void;
}

export function AskMFAModal({ customerName, onClose, onSuccess, onBlocked }: AskMFAModalProps) {
  const [step, setStep] = useState<"initial" | "otp">("initial");
  const [phone, setPhone] = useState("+91 ******3210");
  const [otp, setOtp] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = () => {
    setStep("otp");
    toast.success("OTP sent successfully");
  };

  const handleVerify = () => {
    if (otp === "482193") {
      toast.success("Identity verified successfully");
      onSuccess();
      onClose();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        toast.error("Verification failed. Transaction blocked.");
        onBlocked();
        onClose();
      } else {
        toast.error("Invalid OTP");
      }
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    toast.success("OTP sent successfully");
    setTimer(30);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-strong rounded-3xl p-6 animate-slide-up border border-border/50 shadow-glow">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-center gap-3 text-lg font-bold mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-warning">
            <KeyRound className="h-5 w-5" />
          </div>
          Ask MFA Verification
        </div>

        {step === "initial" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <div className="text-foreground font-medium px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                {customerName}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 bg-white/5 border-white/10"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1 bg-white/5 border-white/10 hover:bg-white/10">Cancel</Button>
              <Button onClick={handleSendOTP} className="flex-1 gradient-brand text-primary-foreground shadow-glow hover:opacity-90">Send OTP</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2 mb-6">
              <div className="text-sm text-muted-foreground">Enter the 6-digit code sent to</div>
              <div className="font-medium text-foreground">{phone}</div>
              <div className="text-[10px] text-muted-foreground mt-2 px-3 py-1 rounded-full bg-white/5 inline-block border border-white/5">
                Demo OTP: 482193
              </div>
            </div>

            <div className="space-y-2">
              <Input 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono py-6 bg-white/5 border-white/10 focus-visible:ring-warning/50"
              />
              {attempts > 0 && (
                <div className="text-xs text-destructive flex items-center justify-center gap-1 mt-2">
                  <AlertTriangle className="h-3 w-3" />
                  {3 - attempts} attempts remaining
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <Button onClick={handleVerify} className="w-full gradient-brand text-primary-foreground shadow-glow hover:opacity-90">
                Verify OTP
              </Button>
              <Button 
                onClick={handleResend} 
                variant="ghost" 
                className={cn("w-full text-muted-foreground hover:bg-white/5 hover:text-foreground", timer > 0 && "opacity-50 cursor-not-allowed")}
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
