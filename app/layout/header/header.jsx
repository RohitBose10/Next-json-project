"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import Avatar from "@mui/material/Avatar";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import LoginModal from "@/app/auth/login/page";
import SignupModal from "@/app/auth/registration/page";
import { ToastContainer, toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import the styles for toastify
import Image from 'next/image'; // Import Image component for optimization

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [userId, setUserId] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // Check local storage for userId and profilePicture
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedProfilePicture = localStorage.getItem("profilePicture");

    if (storedUserId) {
      setUserId(storedUserId);
    }

    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("profilePicture");
    setUserId(null);
    setProfilePicture(null);
    toast.success("Successfully logged out!"); // Show success toast on logout
    setTimeout(() => {
      window.location.href = "/"; // Redirect after toast
    }, 1000); // Delay redirect by 1 second
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
              {/* Using Image component for optimized image */}
              <Image
                src="/assets/images/logo.png"
                alt="Habit Tracker Logo"
                width={120} // Set appropriate width for the logo
                height={120} // Set appropriate height for the logo
                className="mr-2 rounded-md border-2 border-white"
              />
            </Link>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden md:flex items-center space-x-6">
            {userId ? (
              <>
                <Link
                  href={`/dashboard/${userId}`}
                  className="text-white hover:underline decoration-pink-300 decoration-2 underline-offset-4 text-lg font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href={`/myhabits/${userId}`}
                  className="text-white hover:underline decoration-pink-300 decoration-2 underline-offset-4 text-lg font-medium"
                >
                  My Habits
                </Link>
                {profilePicture ? (
                  <Link href={`/profile/${userId}`}>
                    <Avatar
                      src={profilePicture}
                      alt="Profile Picture"
                      className="cursor-pointer"
                      sx={{ width: 40, height: 40 }}
                    />
                  </Link>
                ) : (
                  <Link
                    href={`/profile/${userId}`}
                    className="text-white hover:underline decoration-pink-300 decoration-2 underline-offset-4 text-lg font-medium"
                  >
                    Profile
                  </Link>
                )}
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  className="bg-white text-purple-700 hover:bg-red-500 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setShowLogin(true)}
                  startIcon={<LoginIcon />}
                  className="bg-white text-purple-700 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Login
                </Button>
                <Button
                  onClick={() => setShowSignup(true)}
                  startIcon={<HowToRegIcon />}
                  className="bg-white text-purple-700 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {userId ? (
                <>
                  <MenuItem onClick={handleMenuClose}>
                    <Link href={`/dashboard/${userId}`}>Dashboard</Link>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Link href={`/myhabits/${userId}`}>My Habits</Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={() => setShowLogin(true)}>Login</MenuItem>
                  <MenuItem onClick={() => setShowSignup(true)}>
                    Sign Up
                  </MenuItem>
                </>
              )}
            </Menu>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />

      {/* Add ToastContainer for toasts */}
      <ToastContainer />
    </nav>
  );
};

export default Navbar;
