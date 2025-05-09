"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [userId, setUserId] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const storedProfilePicture = localStorage.getItem("profilePicture");

      setUserId(storedUserId);
      setProfilePicture(storedProfilePicture);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("profilePicture");
    setUserId(null);
    setProfilePicture(null);
    toast.success("Successfully logged out!");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="bg-gradient-to-r from-[#FF62F9] via-[#B94FBC] to-[#9A39B3] shadow-lg">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center text-white text-2xl font-bold"
            >
              <Image
                src="/assets/images/logo.png"
                alt="Habit Tracker Logo"
                width={120}
                height={120}
                className="mr-2 rounded-md border-2 border-white"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {userId ? (
              <>
                <Link
                  href={`/dashboard/${userId}`}
                  className="text-white hover:underline text-lg font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href={`/myhabits/${userId}`}
                  className="text-white hover:underline text-lg font-medium"
                >
                  My Habits
                </Link>
                <Link href={`/profile/${userId}`}>
                  {profilePicture ? (
                    <Avatar
                      src={profilePicture}
                      alt="Profile Picture"
                      className="cursor-pointer"
                      sx={{ width: 40, height: 40 }}
                    />
                  ) : (
                    <span className="text-white hover:underline text-lg font-medium">
                      Profile
                    </span>
                  )}
                </Link>
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  className="bg-white text-purple-700 hover:bg-red-500 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    startIcon={<LoginIcon />}
                    className="bg-white text-purple-700 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/registration">
                  <Button
                    startIcon={<HowToRegIcon />}
                    className="bg-white text-purple-700 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {userId
                ? [
                    <MenuItem key="dashboard" onClick={handleMenuClose}>
                      <Link href={`/dashboard/${userId}`} className="w-full">
                        Dashboard
                      </Link>
                    </MenuItem>,
                    <MenuItem key="myhabits" onClick={handleMenuClose}>
                      <Link href={`/myhabits/${userId}`} className="w-full">
                        My Habits
                      </Link>
                    </MenuItem>,
                    <MenuItem key="logout" onClick={handleLogout}>
                      Logout
                    </MenuItem>,
                  ]
                : [
                    <MenuItem key="login" onClick={() => router.push("/login")}>
                      Login
                    </MenuItem>,
                    <MenuItem
                      key="signup"
                      onClick={() => router.push("/registration")}
                    >
                      Sign Up
                    </MenuItem>,
                  ]}
            </Menu>
          </div>
        </div>
      </div>
      <ToastContainer />
    </nav>
  );
};

export default Navbar;
