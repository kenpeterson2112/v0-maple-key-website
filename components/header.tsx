"use client"

import { Menu } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white px-8 py-4 shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-2">
        <svg className="w-10 h-10 text-[#D2691E]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L9 9L2 9L7 13L5 20L12 16L19 20L17 13L22 9L15 9L12 2Z" />
        </svg>
        <span className="text-3xl font-bold text-[#8B4513]">Maple Key</span>
      </div>
      <button className="text-3xl text-[#8B4513] hover:opacity-80 transition-opacity" aria-label="Menu">
        <Menu size={32} />
      </button>
    </header>
  )
}
