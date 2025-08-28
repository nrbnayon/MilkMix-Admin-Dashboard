"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, ArrowLeft, Clock, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useVerifyOTP, useCreateOTP } from "@/hooks/useApi";
import { toast } from "sonner";

// Validation schema
const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const verifyOTPMutation = useVerifyOTP();
  const createOTPMutation = useCreateOTP();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Initialize timer and email on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    const otpSentTime = localStorage.getItem("otpSentTime");
    const timerKey = `otpTimer_${storedEmail}`;
    const storedTimeLeft = localStorage.getItem(timerKey);

    if (!storedEmail) {
      toast.error("Session expired", {
        description: "Please start the password reset process again.",
      });
      router.push("/forgot-password");
      return;
    }

    setEmail(storedEmail);

    // Calculate remaining time
    if (otpSentTime && storedTimeLeft) {
      const timePassed = Math.floor(
        (Date.now() - parseInt(otpSentTime)) / 1000
      );
      const remainingTime = Math.max(0, parseInt(storedTimeLeft) - timePassed);
      setTimeLeft(remainingTime);
    } else if (otpSentTime) {
      const timePassed = Math.floor(
        (Date.now() - parseInt(otpSentTime)) / 1000
      );
      const remainingTime = Math.max(0, 180 - timePassed);
      setTimeLeft(remainingTime);
      localStorage.setItem(timerKey, remainingTime.toString());
    }
  }, [router]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          // Save timer state to localStorage
          const timerKey = `otpTimer_${email}`;
          localStorage.setItem(timerKey, newTime.toString());
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeLeft, email]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onSubmit = async (data: OtpFormData) => {
    try {
      const response = await verifyOTPMutation.mutateAsync({
        email,
        otp: data.otp,
      });

      if (response.success) {
        toast.success("OTP verified successfully!", {
          description: "Redirecting to reset password...",
          duration: 2000,
        });

        // Store verification status and the verified OTP
        localStorage.setItem("otpVerified", "true");
        localStorage.setItem("verificationTime", Date.now().toString());
        localStorage.setItem("verifiedOTP", data.otp); // Store the verified OTP

        // Clear timer from localStorage
        const timerKey = `otpTimer_${email}`;
        localStorage.removeItem(timerKey);

        // Redirect to reset password after a short delay
        setTimeout(() => {
          router.push("/reset-password");
        }, 1000);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("otp", { message: "Invalid OTP code" });
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await createOTPMutation.mutateAsync({ email });

      if (response.success) {
        // Reset timer
        setTimeLeft(180);
        const newSentTime = Date.now();
        localStorage.setItem("otpSentTime", newSentTime.toString());
        const timerKey = `otpTimer_${email}`;
        localStorage.setItem(timerKey, "180");

        toast.success("OTP resent successfully!", {
          description: `New verification code sent to ${email}`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      // Error is handled by the mutation
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setValue("otp", value);

    // Auto-submit when OTP is complete
    if (value.length === 6) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row bg-white dark:bg-primary-dark">
      {/* Left Side - Welcome Message */}
      <div className="flex-1 bg-sidebar-gradient dark:bg-primary-dark flex items-center justify-center p-4 sm:p-6 lg:p-8 text-white order-2 lg:order-1">
        <div className="max-w-sm sm:max-w-md text-center space-y-4 sm:space-y-6 w-full">
          <div className="w-full flex justify-center items-center">
            <Image
              src="/logo1.png"
              alt="logo"
              width={80}
              height={80}
              className="w-[80px] h-[80px] sm:w-[180px] sm:h-[180px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]"
            />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
            Verify Your Email
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg opacity-90 px-2 sm:px-0">
            We&lsquo;ve sent a 6-digit verification code to your email address.
            Enter the code below to continue.
          </p>
          <div className="pt-2 sm:pt-4 space-y-3">
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm opacity-75">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>
                {timeLeft > 0
                  ? `Expires in ${formatTime(timeLeft)}`
                  : "Code expired"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - OTP Verification Form */}
      <div className="flex-1 bg-white dark:bg-primary-dark flex items-center justify-center p-4 sm:p-6 lg:p-8 order-1 lg:order-2 relative">
        <Card className="w-full max-w-sm sm:max-w-md lg:max-w-2xl p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl lg:rounded-4xl border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="text-center pb-4 sm:pb-6 relative">
            <div className="flex items-center justify-center mb-2 sm:mb-4">
              <Link
                href="/forgot-password"
                className="absolute left-0 top-0 sm:left-2 sm:top-2 lg:left-4 lg:top-4 p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
              </Link>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-white mb-2">
              Enter Verification Code
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm px-2 sm:px-0">
              We&lsquo;ve sent a 6-digit code to{" "}
              <span className="text-indigo-600 dark:text-indigo-400 break-all">
                {email}
              </span>
            </p>
          </CardHeader>

          <CardContent className="px-2 sm:px-4 lg:px-6">
            <form
              className="space-y-4 sm:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* OTP Input */}
              <div className="space-y-2">
                <label className="text-foreground text-sm sm:text-base font-medium block text-center">
                  Verification Code
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={
                      verifyOTPMutation.isPending ||
                      isSubmitting ||
                      timeLeft === 0
                    }
                  >
                    <InputOTPGroup className="gap-1 sm:gap-2">
                      <InputOTPSlot
                        index={0}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg border-primary/30 bg-input text-foreground"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg border-primary/30 bg-input text-foreground"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg border-primary/30 bg-input text-foreground"
                      />
                      <InputOTPSlot
                        index={3}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg border-primary/30 bg-input text-foreground"
                      />
                      <InputOTPSlot
                        index={4}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg border-primary/30 bg-input text-foreground"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg border-primary/30 bg-input text-foreground"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {errors.otp && (
                  <p className="text-error text-xs mt-1 text-center">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              {/* Timer Display */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Code expires in{" "}
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                ) : (
                  <p className="text-error text-xs sm:text-sm">
                    Verification code has expired
                  </p>
                )}
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full h-10 sm:h-12 bg-primary/80 hover:bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500/20 text-sm sm:text-base"
                disabled={
                  verifyOTPMutation.isPending ||
                  isSubmitting ||
                  otp.length !== 6 ||
                  timeLeft === 0
                }
              >
                {verifyOTPMutation.isPending || isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Verifying...</span>
                    <span className="sm:hidden">Verifying...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Verify Code</span>
                    <span className="sm:hidden">Verify</span>
                  </>
                )}
              </Button>

              {/* Resend Button */}
              <div className="text-center space-y-2 sm:space-y-3">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Didn&lsquo;t receive the code?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendOtp}
                  disabled={timeLeft > 0 || createOTPMutation.isPending}
                  className="bg-white/10 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 h-10 sm:h-12 text-sm sm:text-base"
                >
                  {createOTPMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Resending...</span>
                      <span className="sm:hidden">Resending...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Resend Code</span>
                      <span className="sm:hidden">Resend</span>
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs text-muted-foreground px-2 sm:px-0">
                Having trouble?{" "}
                <Link
                  href="/support"
                  className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500 dark:hover:text-indigo-300"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
