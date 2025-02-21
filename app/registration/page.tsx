"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUserPlus } from "react-icons/fa";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (newUser: {
      name: string;
      email: string;
      password: string;
      mobileNumber: string;
      profilePicture?: string | null;
    }) => {
      const response = await axios.post("http://localhost:1000/users", newUser);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User registered successfully!");
      router.push("/login");
    },
    onError: (error: unknown) => {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(
          `Error: ${
            error.response?.data?.message || "An unknown error occurred"
          }`
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, email, password, mobileNumber, profilePicture });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-full max-w-md shadow-2xl bg-gradient-to-br from-purple-600 to-pink-500">
        {/* User Plus Icon */}
        <div className="flex justify-center">
          <FaUserPlus className="text-white text-6xl mb-4" />
        </div>

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-white focus:outline-none"
            required
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-white focus:outline-none"
            required
          />
          <input
            type="tel"
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-white focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-white focus:outline-none"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full mb-4 text-sm text-gray-200"
          />
          {profilePicture && (
            <Image
              src={profilePicture}
              alt="Preview"
              width={80}
              height={80}
              className="mx-auto w-20 h-20 object-cover rounded-full border"
            />
          )}
          <button
            type="submit"
            className="bg-white text-purple-700 px-4 py-3 rounded-lg w-full font-semibold text-lg hover:bg-purple-600 hover:text-white transition shadow-lg"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-white text-center mt-6">
          Already have an account?
          <Link
            href="/login"
            className="text-white font-bold hover:underline ml-1"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
