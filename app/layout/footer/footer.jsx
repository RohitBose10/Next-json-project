import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import the Next.js Image component

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#FF62F9] to-[#9A39B3] text-white py-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center text-white text-2xl font-bold">
            {/* Use Image component for optimized images */}
            <Image
              src="/assets/images/logo.png"
              alt="Habit Tracker Logo"
              width={100}  // Set appropriate width for the logo
              height={100} // Set appropriate height for the logo
              className="mr-2 rounded-md border-2 border-white"
            />
          </Link>
        </div>
        <div className="mt-4 text-md">
          <p>&copy; {new Date().getFullYear()} Trackify. All rights reserved.</p>
          <p className="text-sm mt-4">
            Trackify is a productivity and habit tracker platform designed to help you build healthy habits and stay consistent with your goals. 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
