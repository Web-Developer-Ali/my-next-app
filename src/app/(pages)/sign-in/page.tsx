"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import axios from "axios";

const signInSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must not exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z.string().min(8, "Password is required. At least 8 characters"),
});

const changePasswordSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must not exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    currentPassword: z
      .string()
      .min(8, "Current password is required. At least 8 characters"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(8, "Confirm new password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

type SignInFormData = z.infer<typeof signInSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function AdminSignInPage() {
  const { toast } = useToast();
  const [isChangePassword, setIsChangePassword] = useState(false);

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const changePasswordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSignInSubmit: SubmitHandler<SignInFormData> = async (data) => {
    try {
      const response = await axios.post("/api/admin_login", data); // Using Axios for API call

      if (response.status === 200) {
        toast({
          title: "Sign in successful",
          description: "Welcome back, admin!",
        });
        window.location.reload();
      } else {
        toast({
          title: "Sign in failed",
          description: response.data.error || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in signing in admin:", error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const onChangePasswordSubmit: SubmitHandler<ChangePasswordFormData> = async (
    data
  ) => {
    try {
      const response = await fetch("/api/admin_login", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Password changed successfully",
          description: "Your admin password has been updated",
        });
        changePasswordForm.reset();
        setIsChangePassword(false); // Switch back to login form
      } else {
        toast({
          title: "Password change failed",
          description: result.error || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in changing admin password:", error);
      toast({
        title: "Password change failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isChangePassword ? "Change Admin Password" : "Admin Sign In"}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="change-password"
              checked={isChangePassword}
              onCheckedChange={setIsChangePassword}
            />
            <Label htmlFor="change-password">Change Password</Label>
          </div>
        </CardHeader>
        <CardContent>
          {isChangePassword ? (
            <form
              onSubmit={changePasswordForm.handleSubmit(onChangePasswordSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="username">Admin Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your admin username"
                  {...changePasswordForm.register("username")}
                />
                {changePasswordForm.formState.errors.username && (
                  <p className="text-sm text-red-500">
                    {changePasswordForm.formState.errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  {...changePasswordForm.register("currentPassword")}
                />
                {changePasswordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {
                      changePasswordForm.formState.errors.currentPassword
                        .message
                    }
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  {...changePasswordForm.register("newPassword")}
                />
                {changePasswordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {changePasswordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="••••••••"
                  {...changePasswordForm.register("confirmNewPassword")}
                />
                {changePasswordForm.formState.errors.confirmNewPassword && (
                  <p className="text-sm text-red-500">
                    {
                      changePasswordForm.formState.errors.confirmNewPassword
                        .message
                    }
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={changePasswordForm.formState.isSubmitting}
              >
                {changePasswordForm.formState.isSubmitting
                  ? "Changing Password..."
                  : "Change Password"}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={signInForm.handleSubmit(onSignInSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="username">Admin Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your admin username"
                  {...signInForm.register("username")}
                />
                {signInForm.formState.errors.username && (
                  <p className="text-sm text-red-500">
                    {signInForm.formState.errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...signInForm.register("password")}
                />
                {signInForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={signInForm.formState.isSubmitting}
              >
                {signInForm.formState.isSubmitting
                  ? "Signing in..."
                  : "Sign in"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
          </section>
  );
}
