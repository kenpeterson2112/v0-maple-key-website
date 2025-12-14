"use client"

import type React from "react"
import { useState, useMemo } from "react"
import useSWR from "swr"
import { Search, X, Plus } from "lucide-react"
import ResourceCard from "./resource-card"
import type { Filters } from "@/lib/types"

interface Resource {
  province: string
  grade_level: string
  subject: string
  curriculum_expectations: string[]
  modality: string
  accessibility: string[]
  publication_year: number[]
  publisher_creator: string
  is_paid: boolean
  topic_title: string
  url: string
  strand: string[]
  description: string
  submitted_by: string
  year_published?: number
}

interface ResultsSectionProps {
  filters: Filters
  sidebarFilters?: { modality: string[]; cost: string[]; accessibility: string[] }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ResultsSection({ filters, sidebarFilters }: ResultsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)

  const { data, error, isLoading } = useSWR<Resource[]>("/resources.json", fetcher, {
    refreshInterval: 3600000,
    revalidateOnFocus: false,
  })

  console.log("[DEBUG] Raw resources:", data?.length)
  console.log("[DEBUG] First resource:", data?.[0])

  const filteredResources = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      console.log("[v0] No data or invalid data structure")
      return []
    }

    console.log("[DEBUG] Active filters:", filters)
    console.log("[DEBUG] Sidebar filters:", sidebarFilters)
    console.log("[v0] Total resources loaded:", data.length)

    return data.filter((resource) => {
      // Province filter
      if (filters.province && filters.province !== "" && filters.province !== "Canada") {
        if (resource.province !== filters.province) {
          return false
        }
      }

      if (filters.grade && filters.grade !== "") {
        const selectedGrades = filters.grade.split(",").map((g) => g.trim())
        // Convert grade_level to string first to handle both number and string types
        const gradeLevelStr = String(resource.grade_level || "")
        const resourceGrades = gradeLevelStr.split(",").map((g) => g.trim())
        const hasMatchingGrade = selectedGrades.some((selectedGrade) => resourceGrades.includes(selectedGrade))
        if (!hasMatchingGrade) {
          return false
        }
      }

      // Subject filter
      if (filters.subject && filters.subject !== "") {
        if (resource.subject?.toLowerCase() !== filters.subject.toLowerCase()) {
          return false
        }
      }

      // Strand filter
      if (filters.strand && filters.strand !== "") {
        const resourceStrands = resource.strand || []
        const hasMatchingStrand = resourceStrands.some((s) => s.toLowerCase() === filters.strand?.toLowerCase())
        if (!hasMatchingStrand) {
          return false
        }
      }

      if (sidebarFilters?.modality && sidebarFilters.modality.length > 0) {
        const resourceModalities = resource.modality ? resource.modality.split(",").map((m) => m.trim()) : []
        console.log("[DEBUG] Resource modalities:", resourceModalities, "Filter:", sidebarFilters.modality)
        const hasMatchingModality = sidebarFilters.modality.some((modalityFilter) =>
          resourceModalities.includes(modalityFilter),
        )
        if (!hasMatchingModality) {
          console.log("[DEBUG] Filtered out - no matching modality")
          return false
        }
      }

      if (sidebarFilters?.cost && sidebarFilters.cost.length > 0) {
        const isPaidResource = resource.is_paid === true
        const hasFreeFilter = sidebarFilters.cost.includes("Free Only")
        const hasPaidFilter = sidebarFilters.cost.includes("Paid")

        // If only Free Only is selected, show only free resources (is_paid = false)
        if (hasFreeFilter && !hasPaidFilter && isPaidResource) {
          return false
        }

        // If only Paid is selected, show only paid resources (is_paid = true)
        if (hasPaidFilter && !hasFreeFilter && !isPaidResource) {
          return false
        }

        // If both are selected, show all resources (no filtering)
      }

      if (sidebarFilters?.accessibility && sidebarFilters.accessibility.length > 0) {
        const hasMatchingAccessibility = sidebarFilters.accessibility.some((accessFilter) => {
          const resourceAccessibility = resource.accessibility?.[0] || ""

          if (accessFilter === "No concerns") {
            return resourceAccessibility.toLowerCase().includes("no concerns")
          } else if (accessFilter === "Some Concerns") {
            return resourceAccessibility.toLowerCase().includes("some concerns")
          } else if (accessFilter === "Not Accessible") {
            return resourceAccessibility.toLowerCase().includes("not accessible")
          }
          return false
        })
        if (!hasMatchingAccessibility) {
          return false
        }
      }

      return true
    })
  }, [data, filters, sidebarFilters])

  console.log("[DEBUG] After filtering:", filteredResources.length)
  console.log("[v0] Filtered resources count:", filteredResources.length)

  const keywordFilteredResources = useMemo(() => {
    if (searchQuery.length < 3) return filteredResources

    const query = searchQuery.toLowerCase()
    return filteredResources.filter((resource) => {
      const searchableFields = [
        resource.topic_title,
        resource.description,
        resource.publisher_creator,
        resource.submitted_by,
        resource.subject,
        resource.province,
        resource.modality,
        resource.url,
        ...(resource.strand || []),
        ...(resource.curriculum_expectations || []),
        ...(resource.accessibility || []),
      ]

      return searchableFields.some((field) => field && String(field).toLowerCase().includes(query))
    })
  }, [filteredResources, searchQuery])

  const sortedResources = useMemo(() => {
    const resources = [...keywordFilteredResources]

    // Default sorting by curriculum expectation, then title
    return resources.sort((a, b) => {
      const codeA = a.curriculum_expectations?.[0] || "ZZZ"
      const codeB = b.curriculum_expectations?.[0] || "ZZZ"
      const codeCompare = codeA.localeCompare(codeB, undefined, { numeric: true })
      if (codeCompare !== 0) return codeCompare
      return (a.topic_title || "").localeCompare(b.topic_title || "")
    })
  }, [keywordFilteredResources])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length >= 3) {
      setIsSearching(true)
      setTimeout(() => setIsSearching(false), 300)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setIsSearching(false)
  }

  if (error) {
    return (
      <div className="w-full px-8 py-6">
        <div className="text-center py-12 bg-white rounded-2xl shadow-md border border-[#E8D5C4]">
          <p className="text-red-600 text-lg font-semibold">Failed to load resources</p>
          <p className="text-[#A8998E] mt-2">Please refresh the page to try again.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full px-8 py-6">
        <div className="text-center py-12 bg-white rounded-2xl shadow-md border border-[#E8D5C4]">
          <p className="text-[#8B4513] text-lg font-semibold">Loading resources...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Results counter and search bar - FIXED position, doesn't scroll */}
      <div className="flex-shrink-0 relative bg-[#FAF3E0] mx-3 md:mx-6 leading-7 py-2 md:py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="w-full sm:w-80 relative">
              <div className="relative flex items-center bg-white border-2 border-[#E8D5C4] rounded-2xl shadow-md px-2.5 md:px-3 py-1.5 focus-within:border-[#FF6B35] transition-colors duration-200">
                <Search size={16} className="text-[#A8998E] mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search within results..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="flex-1 bg-transparent outline-none text-sm text-[#2C2C2C] placeholder-[#A8998E] pr-8"
                />
                {searchQuery.length > 0 && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-2 md:right-3 p-0.5 hover:bg-[#FFE5CC] rounded-full transition-colors duration-200"
                    title="Clear search"
                  >
                    <X size={16} className="text-[#A8998E] hover:text-[#8B4513]" />
                  </button>
                )}
              </div>
              {searchQuery.length > 0 && searchQuery.length < 3 && (
                <p className="absolute top-full left-0 mt-1 text-xs text-[#A8998E] bg-white px-2 py-0.5 rounded shadow-sm border border-[#E8D5C4] z-10">
                  Type at least 3 characters to search
                </p>
              )}
            </div>
            {isSearching && searchQuery.length >= 3 && (
              <span className="text-sm text-[#FF6B35] font-medium whitespace-nowrap">Searching...</span>
            )}
          </div>

          <div className="flex items-center justify-center md:justify-end gap-3 md:ml-auto">
            {/* Showing X resources pill */}
            <div className="text-xs md:text-sm font-semibold text-[#8B4513] px-2.5 md:px-3 py-1.5 bg-white rounded-xl border-2 border-[#8B4513] shadow-sm flex-shrink-0">
              Showing {sortedResources.length} resource{sortedResources.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 md:px-6 pb-4">
        {sortedResources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md border border-[#E8D5C4]">
            <p className="text-[#2C2C2C] text-lg font-semibold">No resources found matching your filters.</p>
            <p className="text-[#A8998E] mt-2">Try adjusting your filter selections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {sortedResources.map((resource, i) => (
              <ResourceCard key={i} resource={resource} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8 mb-4">
          <div className="bg-white rounded-2xl shadow-md border-2 border-[#E8D5C4] p-4 md:p-6 text-center max-w-md mx-3">
            <p className="text-sm md:text-base text-[#2C2C2C] font-medium mb-3 md:mb-4">
              Couldn't find a resource? Know of a good one?
            </p>
            <button
              onClick={() => setShowSubmitDialog(true)}
              className="bg-gradient-to-r from-[#FF6B35] to-[#F4845F] text-white px-5 md:px-6 py-2 rounded-xl text-sm md:text-base font-medium hover:from-[#E85A24] hover:to-[#E37350] transition-all duration-200 flex items-center gap-2 mx-auto min-h-[44px]"
            >
              <Plus size={18} />
              Submit Resource
            </button>
          </div>
        </div>
      </div>

      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
            <button
              onClick={() => setShowSubmitDialog(false)}
              className="absolute top-4 right-4 p-1 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X size={20} className="text-stone-600" />
            </button>
            <div className="text-center pt-2">
              <p className="text-[#2C2C2C] text-base leading-relaxed">
                This is where you would usually submit a great resource for other teachers to use but we aren't
                accepting submissions at this time. Come back later!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
