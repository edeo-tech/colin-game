"use client";

import React from "react";
import AdminGuard from "@/components/auth/AdminGuard";
import Image from "next/image";

const AdminQRCodePage: React.FC = () => {
  return (
    <AdminGuard>
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="p-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-white">Site QR Code</h1>
          <div className="relative w-96 h-96">
            <Image
              src="/qr_code.png"
              alt="Site QR Code"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminQRCodePage;