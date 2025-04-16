"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { FaUserCircle } from "react-icons/fa";


interface User {
  id: string;
  email: string;
  password: string;
  profilePicture?: string | null;
  name: string;
  mobileNumber: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await axios.get<User[]>("http://localhost:1000/users");
        return response.data;
      } catch (err) {
        toast.error("Failed to fetch users");
        throw err;
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (isLoading) {
      toast.info("Loading user data...");
      return;
    }
  
    if (error) {
      toast.error("Network error. Please try again later.");
      return;
    }
  
    const user = users.find((u) => u.email === email && u.password === password);
  
    if (user) {
      toast.success("Login successful!");
      localStorage.setItem("userId", user.id);
      if (user.profilePicture) {
        localStorage.setItem("profilePicture", user.profilePicture);
      }
      // Force full page reload after navigation
      window.location.href = `/dashboard/${user.id}`;
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-full max-w-md shadow-2xl bg-gradient-to-br from-purple-600 to-pink-500">
        <div className="flex justify-center">
          <FaUserCircle className="text-white text-6xl mb-4" />
        </div>

        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-white focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-white text-purple-700 px-4 py-3 rounded-lg w-full font-semibold text-lg hover:bg-purple-600 hover:text-white transition shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-gray-200 text-center mt-4">
          By logging in, you agree to our
          <Link href="/terms" className="text-white font-semibold hover:underline mx-1">
            Terms
          </Link>
          and
          <Link href="/privacy" className="text-white font-semibold hover:underline mx-1">
            Privacy Policy
          </Link>
        </p>

        <p className="text-sm text-white text-center mt-6">
          Don&apos;t have an account?
          <Link href="/registration" className="text-white font-bold hover:underline ml-1">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}