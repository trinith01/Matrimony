"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/services/api";

// Simplified validation schema for the registration form
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm({ onSwitchToLogin, onRegisterSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    try {
      // Transform the data to match your backend schema
      const formattedData = {
        ...values,
        password: values.password, // Note: In a real app, you'd hash this on the server
      };

      // Remove fields not needed in the API request
      delete formattedData.confirmPassword;
      console.log("Formatted Data:", formattedData);

      // Send the data to your backend
      const res = await api.post("/admin/register", formattedData);
      localStorage.setItem("adminToken", res.data.token); // Save token

      // Success
      toast.success("Registration successful! Please login.");
      onRegisterSuccess();
    } catch (error) {
      // Handle errors
      console.error("Form submission error", error);
      toast.error("Failed to register. Please try again.");
    }
  }

  // Custom password input component
  function PasswordInputComponent({ placeholder, ...props }) {
    const isConfirmField = placeholder.includes("Confirm");
    const showPwd = isConfirmField ? showConfirmPassword : showPassword;
    const setShowPwd = isConfirmField
      ? setShowConfirmPassword
      : setShowPassword;

    return (
      <div className="relative">
        <Input
          type={showPwd ? "text" : "password"}
          placeholder={placeholder}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400"
          onClick={() => setShowPwd(!showPwd)}
        >
          {showPwd ? "Hide" : "Show"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Create an account</h2>
        <p className="text-gray-500">
          Join MatriManda to find your perfect partner
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="user123@gmail.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInputComponent
                        placeholder="Create a password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInputComponent
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-800 text-white"
              >
                Create Account
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
}
