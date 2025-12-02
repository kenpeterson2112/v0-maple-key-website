"use client"

import type { Filters } from "@/lib/types"

interface FiltersSectionProps {
  filters: Filters
  setFilters: (filters: Filters) => void
}

export default function FiltersSection({ filters, setFilters }: FiltersSectionProps) {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white p-6 rounded-lg mb-8 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-[#333]">Quick Filters</h2>

      <div className="space-y-6">
        <div>
          <label className="block font-semibold mb-3 text-[#555]">Province</label>
          <select
            className="w-full px-4 py-3 border-2 border-[#ddd] rounded focus:border-[#8B4513] focus:outline-none focus:ring-4 focus:ring-[#8B4513]/10 hover:border-[#8B4513] transition-all bg-white text-base cursor-pointer"
            value={filters.province}
            onChange={(e) => handleFilterChange("province", e.target.value)}
          >
            <option value="">All Provinces</option>
            <option value="AB">Alberta</option>
            <option value="BC">British Columbia</option>
            <option value="MB">Manitoba</option>
            <option value="NB">New Brunswick</option>
            <option value="NL">Newfoundland and Labrador</option>
            <option value="NT">Northwest Territories</option>
            <option value="NS">Nova Scotia</option>
            <option value="NU">Nunavut</option>
            <option value="ON">Ontario</option>
            <option value="PE">Prince Edward Island</option>
            <option value="QC">Quebec</option>
            <option value="SK">Saskatchewan</option>
            <option value="YT">Yukon</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-3 text-[#555]">Grade</label>
          <select
            className="w-full px-4 py-3 border-2 border-[#ddd] rounded focus:border-[#8B4513] focus:outline-none focus:ring-4 focus:ring-[#8B4513]/10 hover:border-[#8B4513] transition-all bg-white text-base cursor-pointer"
            value={filters.grade}
            onChange={(e) => handleFilterChange("grade", e.target.value)}
          >
            <option value="">All Grades</option>
            <option value="5">Grade 5</option>
            <option value="6">Grade 6</option>
            <option value="7">Grade 7</option>
            <option value="8">Grade 8</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-3 text-[#555]">Subject</label>
          <select
            className="w-full px-4 py-3 border-2 border-[#ddd] rounded focus:border-[#8B4513] focus:outline-none focus:ring-4 focus:ring-[#8B4513]/10 hover:border-[#8B4513] transition-all bg-white text-base cursor-pointer"
            value={filters.subject}
            onChange={(e) => handleFilterChange("subject", e.target.value)}
          >
            <option value="">All Subjects</option>
            <option value="math">Math</option>
            <option value="science">Science</option>
            <option value="stem">STEM</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-3 text-[#555]">Topic</label>
          <select
            className="w-full px-4 py-3 border-2 border-[#ddd] rounded focus:border-[#8B4513] focus:outline-none focus:ring-4 focus:ring-[#8B4513]/10 hover:border-[#8B4513] transition-all bg-white text-base cursor-pointer"
            value={filters.topic}
            onChange={(e) => handleFilterChange("topic", e.target.value)}
          >
            <option value="">All Topics</option>
            <option value="whole-numbers">Whole Numbers</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-3 text-[#555]">Learning Type</label>
          <select
            className="w-full px-4 py-3 border-2 border-[#ddd] rounded focus:border-[#8B4513] focus:outline-none focus:ring-4 focus:ring-[#8B4513]/10 hover:border-[#8B4513] transition-all bg-white text-base cursor-pointer"
            value={filters.learningType}
            onChange={(e) => handleFilterChange("learningType", e.target.value)}
          >
            <option value="">All Types</option>
            <option value="lesson">Lesson</option>
            <option value="video">Video</option>
            <option value="class-trip">Class Trip</option>
          </select>
        </div>
      </div>
    </div>
  )
}
