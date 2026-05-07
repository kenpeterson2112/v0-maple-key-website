"use client"

import { useEffect, useRef, useState } from "react"
import SearchHeader from "@/components/search-header"
import SidebarFilters from "@/components/sidebar-filters"
import ResultsSection from "@/components/results-section"
import HeroPersonalize from "@/components/hero-personalize"
import MobileFiltersDrawer from "@/components/mobile-filters-drawer"
import BackToTopButton from "@/components/back-to-top-button"
import type { Filters } from "@/lib/types"
import { clearPrefs, getPrefs, inferProvinceFromTimeZone, setPrefs } from "@/lib/personalization"

const EMPTY_FILTERS: Filters = {
  province: "",
  grade: "",
  subject: "",
  strand: "",
  topic: "",
  learningType: "",
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [inferred, setInferred] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const skipPersistOnce = useRef(true)

  const [sidebarFilters, setSidebarFilters] = useState<{ modality: string[]; cost: string[]; accessibility: string[] }>({
    modality: [],
    cost: [],
    accessibility: [],
  })
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [resultCount, setResultCount] = useState(0)

  // On mount, hydrate from localStorage (or fall back to timezone inference).
  useEffect(() => {
    const prefs = getPrefs()
    setFilters({
      ...EMPTY_FILTERS,
      province: prefs.province,
      grade: prefs.grade,
      subject: prefs.subject,
      strand: prefs.strand,
    })
    setInferred(prefs.inferred)
    setHydrated(true)
  }, [])

  // Persist filters to localStorage on user-driven changes (skip the hydration write).
  useEffect(() => {
    if (!hydrated) return
    if (skipPersistOnce.current) {
      skipPersistOnce.current = false
      return
    }
    setPrefs({
      province: filters.province,
      grade: filters.grade,
      subject: filters.subject,
      strand: filters.strand ?? "",
    })
    setInferred(false)
  }, [filters.province, filters.grade, filters.subject, filters.strand, hydrated])

  const handleSidebarFilterChange = (filterGroup: string, selectedItems: string[]) => {
    setSidebarFilters((prev) => ({ ...prev, [filterGroup as keyof typeof prev]: selectedItems }))
  }

  const handleResetInferred = () => {
    clearPrefs()
    setFilters({ ...EMPTY_FILTERS, province: inferProvinceFromTimeZone(), grade: "", subject: "", strand: "" })
    setInferred(true)
  }

  const totalActiveFilters =
    (filters.grade ? filters.grade.split(",").length : 0) +
    (filters.subject ? 1 : 0) +
    (filters.strand ? 1 : 0) +
    Object.values(sidebarFilters).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="flex h-screen flex-col bg-[#FAF3E0]">
      <SearchHeader
        filters={filters}
        setFilters={setFilters}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        totalActiveFilters={totalActiveFilters}
      />

      <HeroPersonalize
        filters={filters}
        setFilters={setFilters}
        resultCount={resultCount}
        inferred={inferred}
        onReset={handleResetInferred}
      />

      <div className="flex flex-1 min-h-0">
        <SidebarFilters onFilterChange={handleSidebarFilterChange} sidebarFilters={sidebarFilters} />
        <div className="flex-1 min-w-0">
          <ResultsSection
            filters={filters}
            sidebarFilters={sidebarFilters}
            onCountChange={setResultCount}
          />
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
