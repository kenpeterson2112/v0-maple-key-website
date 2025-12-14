"use client"

import { useState } from "react"
import SearchHeader from "@/components/search-header"
import SidebarFilters from "@/components/sidebar-filters"
import ResultsSection from "@/components/results-section"
import LoginModal from "@/components/login-modal"
import MobileFiltersDrawer from "@/components/mobile-filters-drawer"
import BackToTopButton from "@/components/back-to-top-button"
import type { Filters } from "@/lib/types"

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    province: "",
    grade: "",
    subject: "",
    topic: "",
    learningType: "",
  })

  const [sidebarFilters, setSidebarFilters] = useState<{ [key: string]: string[] }>({
    modality: [],
    accessibility: [],
    cost: [],
  })

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const handleSidebarFilterChange = (filterGroup: string, selectedItems: string[]) => {
    setSidebarFilters((prev) => ({
      ...prev,
      [filterGroup]: selectedItems,
    }))
  }

  const handleLogin = (province: string, grades: string[]) => {
    setFilters((prev) => ({
      ...prev,
      province: province,
      grade: grades.join(","),
    }))
  }

  const totalActiveFilters =
    (filters.grade ? filters.grade.split(",").length : 0) +
    (filters.subject ? 1 : 0) +
    (filters.strand ? 1 : 0) +
    Object.values(sidebarFilters).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="h-screen bg-[#FAF3E0] overflow-hidden">
      <LoginModal onLogin={handleLogin} />
      <SearchHeader
        filters={filters}
        setFilters={setFilters}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        totalActiveFilters={totalActiveFilters}
      />
      <div className="flex h-[calc(100vh-80px)]">
        <SidebarFilters onFilterChange={handleSidebarFilterChange} sidebarFilters={sidebarFilters} />
        <div className="flex-1">
          <ResultsSection filters={filters} sidebarFilters={sidebarFilters} />
        </div>
      </div>

      <MobileFiltersDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        sidebarFilters={sidebarFilters}
        onSidebarFilterChange={handleSidebarFilterChange}
      />

      <BackToTopButton />
    </div>
  )
}
