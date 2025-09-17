"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminGuard from "@/components/auth/AdminGuard";
import Image from "next/image";

const AdminQRCodePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for live effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Particle animation for background
  const particles = Array.from({ length: 30 }, (_, i) => i);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden relative">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse" />
          {particles.map((particle) => (
            <motion.div
              key={particle}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                opacity: Math.random() * 0.5 + 0.3
              }}
              animate={{
                y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
                opacity: [null, Math.random() * 0.8 + 0.2]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* LIVE Competition Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 rounded-full text-white font-bold text-xl mb-6 shadow-lg shadow-red-500/30"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
              <span>LIVE COMPETITION</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4 tracking-wider"
              style={{ 
                textShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              JOIN THE GAME!
            </motion.h1>

            {/* Live Time */}
            <motion.div 
              className="text-gray-300 text-xl font-medium"
              key={currentTime.getSeconds()}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              🕐 LIVE: {currentTime.toLocaleTimeString()}
            </motion.div>
          </motion.div>

          {/* QR Code Section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* QR Code Container */}
            <motion.div
              className="relative mb-8"
              animate={{ 
                scale: [1, 1.02, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Multiple Glowing Rings */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-2xl opacity-60"
                style={{ width: '600px', height: '600px', left: '-100px', top: '-100px' }}
                animate={{ 
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full blur-xl opacity-80"
                style={{ width: '500px', height: '500px', left: '-50px', top: '-50px' }}
                animate={{ 
                  opacity: [0.6, 1, 0.6],
                  scale: [1.1, 1, 1.1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* QR Code */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border-4 border-cyan-400" style={{ width: '400px', height: '400px' }}>
                <div className="relative w-full h-full">
                  <Image
                    src="/qr_code.png"
                    alt="Scan to Play!"
                    fill
                    className="object-contain rounded-2xl"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <motion.h2 
                className="text-5xl font-black text-white mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
              >
                📱 SCAN TO PLAY NOW!
              </motion.h2>
              
              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 rounded-2xl inline-block shadow-lg shadow-green-500/30"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-white font-bold text-2xl">
                  🎯 WIN AMAZING PRIZES!
                </p>
                <p className="text-green-100 text-lg">
                  Top players receive rewards
                </p>
              </motion.div>

              <div className="mt-6 space-y-2">
                <p className="text-cyan-400 text-xl font-bold">
                  🚀 GET YOUR SCHOOL UP THE LEADERBOARD
                </p>
                <p className="text-white text-lg">
                  Every point counts towards your school&apos;s ranking!
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Footer Instructions */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-2 border-purple-500/50 rounded-2xl p-6 max-w-2xl">
              <h3 className="text-2xl font-bold text-white mb-3">📋 HOW TO PLAY:</h3>
              <div className="text-left space-y-2 text-lg text-gray-200">
                <p>1. 📱 Scan the QR code with your phone</p>
                <p>2. 📝 Register with your school details</p>
                <p>3. 🎮 Answer math questions for 60 seconds</p>
                <p>4. 🏆 Climb the leaderboard and win!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminQRCodePage;