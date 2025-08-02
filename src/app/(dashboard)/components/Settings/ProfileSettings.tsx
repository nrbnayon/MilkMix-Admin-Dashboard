// src\app\(dashboard)\components\Settings\ProfileSettings.tsx
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Camera,
  Edit3,
  Save,
  X,
  User,
  MapPin,
  Phone,
  FileText,
  Mail,
  Trash2,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Lordicon from "@/components/lordicon/lordicon-wrapper";

// Validation schema
const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "Nrb Nayon",
      phone: "+880 1234 567890",
      bio: "Full-stack developer specializing in MERN stack with a passion for creating scalable web applications.",
      location: "Dhaka, Bangladesh",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        setIsUploading(false);
        toast.success("Profile image updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Profile updated:", data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.log("Faild update profile::", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
    toast.info("Changes discarded");
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    setIsDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    console.log("account deleted");
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background rounded-xl">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 rounded-t-xl">
        <div className="w-full mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-md md:text-2xl font-bold text-slate-900">
                Profile Settings
              </h1>
              <p className="text-sm md:text-lg text-slate-600 mt-1">
                Manage your personal information
              </p>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                size="lg"
                className="inline-flex items-center gap-2 px-6 py-4 bg-primary/90 text-white rounded-md hover:bg-primary transition-all duration-200 font-medium"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-3 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Profile Image Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-3 md:p-6 h-fit sticky top-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        width={128}
                        height={128}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <Lordicon
                          src="https://cdn.lordicon.com/hhljfoaj.json"
                          trigger="hover"
                          size={120}
                          stroke={3}
                        />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>

                <h3 className="font-semibold text-slate-900 mb-1">
                  Profile Picture
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  JPG, PNG or GIF. Max 5MB.
                </p>

                {isUploading && (
                  <div className="mb-4">
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 rounded-full animate-pulse w-3/4"></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Uploading...</p>
                  </div>
                )}
              </div>
            </div>
            {/* Additional Settings */}
            <div className="hidden md:flex-col w-full mt-4 rounded-xl border border-gray-200 p-3 md:p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Account Settings
              </h2>
              <div className="space-y-4">
                <div className="w-full">
                  <button
                    onClick={() => {
                      console.log("Logout clicked");
                    }}
                    className="w-full cursor-pointer"
                  >
                    <div className="flex items-center gap-3 p-2 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200">
                      <LogOut className="h-6 w-6 flex-shrink-0 stroke-2 text-red-400 hover:text-red-500" />
                      Log Out
                    </div>
                  </button>
                </div>
                {/* Delete Account Section */}
                <div className="bg-gray-100 rounded-lg p-6 border border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-error font-medium text-base">
                        Delete Account
                      </h3>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={handleDeleteAccount}
                          className="bg-error  hover:bg-error/90 cursor-pointer text-white px-2"
                        >
                          Apply Delete
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <div className="border-2 border-error rounded-lg h-12 w-12">
                            <Trash2 className="text-error p-2 h-11 w-11" />
                          </div>
                          <DialogTitle className="text-xl md:text-2xl">
                            Are you sure you want to{" "}
                            <span className="text-error">Delete</span> your
                            account?
                          </DialogTitle>
                          <DialogDescription>
                            Inter your current password you used login with
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="grid grid-cols-2 gap-6 w-full justify-between">
                          <Button
                            variant="outline"
                            onClick={handleDeleteCancel}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                          >
                            Yes Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-3 md:p-6">
              {/* Card Header */}
              <div className="flex-col flex space-y-3 md:flex-row items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Personal Information
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Update your personal details here
                  </p>
                </div>
                {isEditing && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center gap-2 px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 font-medium"
                    >
                      <Save className="w-4 h-4" />
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Full Name & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      Full Name
                    </label>
                    <input
                      {...register("full_name")}
                      type="text"
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-md transition-all duration-200 ${
                        isEditing
                          ? "border-primary/30 focus:border-blue-500 focus:ring-0 bg-white text-black"
                          : "border-primary/30 bg-slate-50 cursor-not-allowed text-slate-700"
                      } ${errors.full_name ? "border-red-400" : ""}`}
                    />
                    {errors.full_name && (
                      <p className="text-sm text-red-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-purple-600" />
                      </div>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value="nayon@example.com"
                      disabled
                      className="w-full px-4 py-3 border-2 border-primary/30 bg-slate-50 rounded-md cursor-not-allowed text-black"
                    />
                  </div>
                </div>

                {/* Phone & Location Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      Phone Number
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-md transition-all duration-200 ${
                        isEditing
                          ? "border-primary/30 focus:border-blue-500 focus:ring-0 bg-white text-black"
                          : "border-slate-100 bg-slate-50 cursor-not-allowed text-slate-600"
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-orange-600" />
                      </div>
                      Location
                    </label>
                    <input
                      {...register("location")}
                      type="text"
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-md transition-all duration-200 ${
                        isEditing
                          ? "border-primary/30 focus:border-blue-500 focus:ring-0 bg-white text-black"
                          : "border-slate-100 bg-slate-50 cursor-not-allowed text-slate-600"
                      }`}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-indigo-600" />
                    </div>
                    Bio
                  </label>
                  <textarea
                    {...register("bio")}
                    rows={4}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 resize-none ${
                      isEditing
                        ? "border-slate-200 focus:border-blue-500 focus:ring-0 bg-white text-black"
                        : "border-slate-100 bg-slate-50 cursor-not-allowed text-slate-600"
                    } ${errors.bio ? "border-red-400" : ""}`}
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex items-center justify-between">
                    {errors.bio ? (
                      <p className="text-sm text-red-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                        {errors.bio.message}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                        Maximum 500 characters
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="flex-col md:hidden w-full mt-4 rounded-xl border border-gray-200 p-3 md:p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Account Settings
            </h2>
            <div className="space-y-4">
              <div className="w-full">
                <button
                  onClick={() => {
                    console.log("Logout clicked");
                  }}
                  className="w-full cursor-pointer"
                >
                  <div className="flex items-center gap-3 p-2 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200">
                    <LogOut className="h-6 w-6 flex-shrink-0 stroke-2 text-red-400 hover:text-red-500" />
                    Log Out
                  </div>
                </button>
              </div>
              {/* Delete Account Section */}
              <div className="bg-gray-100 rounded-lg p-6 border border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-error font-medium text-base">
                      Delete Account
                    </h3>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={handleDeleteAccount}
                        className="bg-error  hover:bg-error/90 cursor-pointer text-white px-2"
                      >
                        Apply Delete
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
