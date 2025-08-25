"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Shield, Save, Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { passwordValidationSchema } from "@/lib/formDataValidation";
type PasswordFormData = z.infer<typeof passwordValidationSchema>;
export default function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordValidationSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const newPassword = watch("newPassword");
  // Password strength validation
  const passwordValidation = {
    hasMinLength: newPassword ? newPassword.length >= 8 : false,
    hasUpperLower: newPassword
      ? /(?=.*[a-z])(?=.*[A-Z])/.test(newPassword)
      : false,
    hasNumber: newPassword ? /(?=.*\d)/.test(newPassword) : false,
    hasNoSpaces: newPassword ? !/\s/.test(newPassword) : false,
  };

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log the form data to console (excluding passwords for security)
      console.log("Password Change Data:", {
        passwordLength: data.newPassword.length,
        timestamp: new Date().toISOString(),
      });

      toast.success("Password updated successfully!", {
        description: "Your password has been changed.",
        duration: 2000,
      });
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("Password update failed", {
        description: "Please try again later.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center space-x-3 mb-4 sm:mb-6">
        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Security Settings
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your account security
          </p>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Change Password */}
        <div className="border border-primary/30 rounded-lg p-4 sm:p-6">
          <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
            Change Password
          </h4>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  {...register("currentPassword")}
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 h-10 sm:h-12 rounded-md border-primary/30 focus-visible:border-primary bg-input text-foreground focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="Enter your current password"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-error text-xs mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    {...register("newPassword")}
                    type={showNewPassword ? "text" : "password"}
                    className="w-full pl-10 pr-10 h-10 sm:h-12 rounded-md border-primary/30 focus-visible:border-primary bg-input text-foreground focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="Enter your new password"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-error text-xs mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full pl-10 pr-10 h-10 sm:h-12 rounded-md border-primary/30 focus-visible:border-primary bg-input text-foreground focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="Confirm your new password"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-error text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password Strength Indicator */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                <p className="mb-2">Password must contain:</p>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        passwordValidation.hasMinLength
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        passwordValidation.hasUpperLower
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span>Uppercase and lowercase letters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        passwordValidation.hasNumber
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span>At least one number</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full flex justify-end items-end">
              <Button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                disabled={isLoading || isSubmitting}
              >
                <Save className="w-4 h-4" />
                <span>Update Password</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div className="border border-primary/30 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base sm:text-lg font-medium text-gray-900">
                Two-Factor Authentication
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
