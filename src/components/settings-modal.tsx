"use client"

import { X, User, Mail, Globe } from "lucide-react"
import { useState } from "react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [name, setName] = useState("Ken Peterson")
  const [email, setEmail] = useState("ken.peterson@maplekey.edu")
  const [language, setLanguage] = useState("English")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#FAF3E0] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E8D5C4]">
          <h2 className="text-2xl font-bold text-[#2C2C2C]">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#E8D5C4] rounded-full transition-colors">
            <X size={24} className="text-[#8B4513]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#333]">
              <User size={16} className="text-[#8B4513]" />
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-[#E8D5C4] rounded-xl text-[#2C2C2C] focus:outline-none focus:border-[#8B4513] transition-colors"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#333]">
              <Mail size={16} className="text-[#8B4513]" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-[#E8D5C4] rounded-xl text-[#2C2C2C] focus:outline-none focus:border-[#8B4513] transition-colors"
            />
          </div>

          {/* Language Dropdown */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#333]">
              <Globe size={16} className="text-[#8B4513]" />
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-[#E8D5C4] rounded-xl text-[#2C2C2C] focus:outline-none focus:border-[#8B4513] transition-colors cursor-pointer"
            >
              <option value="English">English</option>
              <option value="French">French</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E8D5C4]">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#8B4513] hover:bg-[#6B3410] text-white font-semibold rounded-xl transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
