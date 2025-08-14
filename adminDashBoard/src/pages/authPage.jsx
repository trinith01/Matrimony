"use client";

import { useState } from "react";
import { Heart, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Column - Authentication */}
      <div className="w-full md:w-1/2 bg-white p-6 md:p-12 flex items-center justify-center order-2 md:order-1">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center md:hidden">
            <Heart className="h-6 w-6 mr-2 text-red-800 fill-red-800" />
            <h1 className="text-2xl font-bold">LoveMatch</h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-red-800 to-pink-500 bg-clip-text text-transparent">
              MatriMantra Admin Panel
            </span>
          </h2>

          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* <TabsList className="grid w-full grid-cols-1 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList> */}

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Column - Landing Page */}
      <div className="w-full md:w-1/2 order-1 md:order-2 relative overflow-hidden bg-gradient-to-br from-black to-red-950">
        <div className="relative z-10 h-full flex flex-col p-6 md:p-12 text-white">
          <div>
            <div className="flex items-center mb-12">
              <Heart className="h-8 w-8 mr-2 fill-red-400" />
              <h1 className="text-3xl font-bold text-red-400">LoveMatch</h1>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                Find your{" "}
                <span className="bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">
                  perfect match
                </span>
              </h2>

              <div className="mb-8">
                <p className="text-lg opacity-90">
                  Discover meaningful connections with people who share your
                  interests, values, and lifestyle.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-red-500/30 p-2 rounded-full mr-3 flex-shrink-0">
                    <Check className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-red-600">
                      Advanced Matching
                    </h3>
                    <p className="text-gray-300">
                      Our algorithm finds compatible matches based on your
                      preferences
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-500/30 p-2 rounded-full mr-3 flex-shrink-0">
                    <Check className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-red-600">
                      Verified Profiles
                    </h3>
                    <p className="text-gray-300">
                      Connect with real people looking for genuine relationships
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-500/30 p-2 rounded-full mr-3 flex-shrink-0">
                    <Check className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-red-600">
                      Privacy First
                    </h3>
                    <p className="text-gray-300">
                      Your data is secure and your privacy is our priority
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="border-t border-red-900/30 pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-300">
                    Join thousands of singles who have found love on LoveMatch
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-red-300 to-red-500 border-2 border-black flex items-center justify-center text-xs font-bold text-white"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="ml-2 text-sm text-gray-300">
                    <span className="font-bold text-red-600">4,000+</span>{" "}
                    matches made today
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
