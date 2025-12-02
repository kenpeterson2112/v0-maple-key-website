"use client"

import { useState } from "react"
import SearchHeader from "@/components/search-header"
import SidebarFilters from "@/components/sidebar-filters"
import ResultsSection from "@/components/results-section"
import type { Filters } from "@/lib/types"

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    province: "", // Empty shows all provinces
    grade: "", // Empty shows all grades
    subject: "", // Empty shows all subjects
    topic: "", // Empty shows all topics
    learningType: "", // Empty shows all types
  })

  const [sidebarFilters, setSidebarFilters] = useState<{ [key: string]: string[] }>({
    modality: [],
    accessibility: [],
  })

  const handleSidebarFilterChange = (filterGroup: string, selectedItems: string[]) => {
    setSidebarFilters((prev) => ({
      ...prev,
      [filterGroup]: selectedItems,
    }))
  }

  return (
    <div className="h-screen bg-[#FAF3E0] overflow-hidden">
      <SearchHeader filters={filters} setFilters={setFilters} />
      <div className="flex h-[calc(100vh-80px)]">
        <SidebarFilters onFilterChange={handleSidebarFilterChange} />
        <ResultsSection filters={filters} sidebarFilters={sidebarFilters} />
      </div>
    </div>
  )
}
