"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useContext } from "react";

import { AuthContext } from "../lib/context/AuthContext";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm({ onSwitchToRegister }) {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // Redirect to protected page
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //   }
  // };

  async function onSubmit(values) {
    try {
      const { email, password } = values;
      const res = await api.post("/login", {
        email,
        password,
      });
      login(res.data.user, res.data.token);

      // Store token
      toast.success("Login successful!");
      navigate("/home");
    } catch (error) {
      console.error("Form submission error", error);
      alert("Failed to login. Please try again.");
      toast.error("Failed to login. Please try again.");
    }
  }

  return (
    <>
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Sign in to your account to continue
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="user123@gmail.com"
                    type="email"
                    {...field}
                    className="rounded-lg border-gray-300 focus:border-red-800 focus:ring-red-800"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-800" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      className="rounded-lg border-gray-300 focus:border-red-800 focus:ring-red-800 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-red-800 hover:bg-red-800/10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "hide" : "show"}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-800" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs sm:text-sm text-red-800 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white rounded-lg shadow-md"
          >
            Sign In
          </Button>

          <div className="text-center text-xs sm:text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-red-800 hover:underline font-medium"
            >
              Register now
            </button>
          </div>
        </form>
      </Form>
    </>
  );
}
