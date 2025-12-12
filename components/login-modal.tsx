"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Mail, MapPin, GraduationCap, Building2 } from "lucide-react"

interface LoginModalProps {
  onLogin: (province: string, grades: string[]) => void
}

const PROVINCES = [
  { code: "ON", name: "Ontario" },
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "QC", name: "Quebec" },
  { code: "MB", name: "Manitoba" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "PE", name: "Prince Edward Island" },
]

const GRADES = ["6", "7", "8", "9"]

export default function LoginModal({ onLogin }: LoginModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [province, setProvince] = useState("")
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [schoolDistrict, setSchoolDistrict] = useState("")

  useEffect(() => {
    // Check if user has already logged in this session
    const hasLoggedIn = sessionStorage.getItem("maplekey_logged_in")
    if (!hasLoggedIn) {
      setIsOpen(true)
    }
  }, [])

  const handleGradeToggle = (grade: string) => {
    setSelectedGrades((prev) => (prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]))
  }

  const handleSubmit = () => {
    // Store login state in sessionStorage
    sessionStorage.setItem("maplekey_logged_in", "true")

    // Call onLogin with selected province and grades
    onLogin(province, selectedGrades)

    // Close modal
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-[#FAF3E0] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 border border-[#E8D5C4]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/Maple_Key_Transp_Background.png"
            alt="Maple Key Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#8B4513] text-center mb-2">Welcome to Maple Key</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Sign in to find curriculum-aligned resources for your classroom
        </p>

        {/* Form */}
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#8B4513] mb-1">
              <Mail size={16} />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg border border-[#E8D5C4] bg-white text-[#8B4513] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
          </div>

          {/* Province */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#8B4513] mb-1">
              <MapPin size={16} />
              Province
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#E8D5C4] bg-white text-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            >
              <option value="">Select a province</option>
              {PROVINCES.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Grades */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#8B4513] mb-2">
              <GraduationCap size={16} />
              Grade(s)
            </label>
            <div className="flex gap-3">
              {GRADES.map((grade) => (
                <label key={grade} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGrades.includes(grade)}
                    onChange={() => handleGradeToggle(grade)}
                    className="w-5 h-5 rounded border-[#E8D5C4] text-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                  <span className="text-[#8B4513] font-medium">Grade {grade}</span>
                </label>
              ))}
            </div>
          </div>

          {/* School District */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#8B4513] mb-1">
              <Building2 size={16} />
              School District
            </label>
            <input
              type="text"
              value={schoolDistrict}
              onChange={(e) => setSchoolDistrict(e.target.value)}
              placeholder="Enter your school district (optional)"
              className="w-full px-4 py-2 rounded-lg border border-[#E8D5C4] bg-white text-[#8B4513] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-md"
        >
          Get Started
        </button>

        {/* Demo note */}
        <p className="text-xs text-gray-400 text-center mt-4">For demo purposes only</p>
      </div>
    </div>
  )
}
