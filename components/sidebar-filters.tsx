"use client"

import { useState } from "react"
import {
  ChevronDown,
  BookOpen,
  Globe,
  MousePointerClick,
  Video,
  Headphones,
  MapPin,
  Mic,
  DollarSign,
  CheckCircle2,
} from "lucide-react"
import Image from "next/image"

interface SidebarFiltersProps {
  onFilterChange: (filterGroup: string, selectedItems: string[]) => void
}

export default function SidebarFilters({ onFilterChange }: SidebarFiltersProps) {
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({
    modality: true,
    cost: true, // Added cost filter group
    accessibility: true,
  })
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    modality: [],
    cost: [], // Added cost filter state
    accessibility: [],
  })

  const filterOptions = {
    modality: ["Books & Print Media", "Online", "Interactive", "Video", "Audio/Podcast", "Trip", "Guest Speaker"],
    cost: ["Free Only", "Paid"], // Updated "Free" to "Free Only" for clarity
    accessibility: ["No concerns", "Some Concerns (see details)", "Not Accessible"],
  }

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  const toggleFilter = (group: string, option: string) => {
    setSelectedFilters((prev) => {
      const current = prev[group] || []
      const updated = current.includes(option) ? current.filter((item) => item !== option) : [...current, option]

      setTimeout(() => onFilterChange(group, updated), 0)

      return {
        ...prev,
        [group]: updated,
      }
    })
  }

  const handleClearAll = () => {
    const clearedFilters = {
      modality: [],
      cost: [], // Include cost in clear all
      accessibility: [],
    }
    setSelectedFilters(clearedFilters)

    // Notify parent of changes
    setTimeout(() => {
      onFilterChange("modality", [])
      onFilterChange("cost", []) // Clear cost filter
      onFilterChange("accessibility", [])
    }, 0)
  }

  const totalActiveFilters = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0)

  const getModalityIcon = (modality: string) => {
    const iconProps = { size: 14, className: "flex-shrink-0" }

    switch (modality) {
      case "Books & Print Media":
        return <BookOpen {...iconProps} style={{ color: "#D9742A" }} /> // Burnt Orange
      case "Online":
        return <Globe {...iconProps} style={{ color: "#4CAFB5" }} /> // Soft Teal
      case "Interactive":
        return <MousePointerClick {...iconProps} style={{ color: "#849657" }} /> // Olive Green
      case "Video":
        return <Video {...iconProps} style={{ color: "#FFC107" }} /> // Golden Yellow
      case "Audio/Podcast":
        return <Headphones {...iconProps} style={{ color: "#D9742A" }} /> // Burnt Orange
      case "Trip":
        return <MapPin {...iconProps} style={{ color: "#4CAFB5" }} /> // Soft Teal
      case "Guest Speaker":
        return <Mic {...iconProps} style={{ color: "#849657" }} /> // Olive Green
      default:
        return null
    }
  }

  const getCostIcon = (cost: string) => {
    const iconProps = { size: 14, className: "flex-shrink-0" }

    switch (cost) {
      case "Free Only": // Updated case to match new "Free Only" label
        return <CheckCircle2 {...iconProps} style={{ color: "#849657" }} /> // Olive Green for free
      case "Paid":
        return <DollarSign {...iconProps} style={{ color: "#D9742A" }} /> // Burnt Orange for paid
      default:
        return null
    }
  }

  const getAccessibilityIcon = (accessibility: string) => {
    if (accessibility === "No concerns") {
      return (
        <Image
          src="/icons/accessibility-green.svg"
          alt="No concerns"
          width={14}
          height={14}
          className="flex-shrink-0"
        />
      )
    } else if (accessibility === "Some Concerns (see details)") {
      return (
        <Image
          src="/icons/accessibility-yellow.svg"
          alt="Some concerns"
          width={14}
          height={14}
          className="flex-shrink-0"
        />
      )
    } else if (accessibility === "Not Accessible") {
      return (
        <Image
          src="/icons/accessibility-orange.svg"
          alt="Not accessible"
          width={14}
          height={14}
          className="flex-shrink-0"
        />
      )
    }
    return null
  }

  return (
    <aside className="w-[20%] bg-[#FAF3E0] border-r border-[#E8D5C4] p-4 overflow-y-auto shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-[#8B4513]">Filters</h2>
          {totalActiveFilters > 0 && (
            <span className="px-2 py-0.5 bg-[#FF6B35] text-white text-xs font-semibold rounded-full">
              {totalActiveFilters}
            </span>
          )}
        </div>
        {totalActiveFilters > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-[#8B4513] hover:text-[#FF6B35] underline cursor-pointer transition-colors duration-150"
          >
            Clear All
          </button>
        )}
      </div>

      {Object.entries(filterOptions).map(([groupKey, options]) => (
        <div key={groupKey} className="mb-4 pb-4 border-b border-[#E8D5C4] last:border-b-0">
          <button onClick={() => toggleGroup(groupKey)} className="flex items-center justify-between w-full mb-3 group">
            <h3 className="text-sm font-semibold text-[#8B4513] capitalize group-hover:text-[#FF6B35] transition-colors duration-150">
              {groupKey}
            </h3>
            <ChevronDown
              size={16}
              className={`text-[#A8998E] transition-transform duration-200 ${expandedGroups[groupKey] ? "" : "-rotate-90"}`}
            />
          </button>

          {expandedGroups[groupKey] && (
            <div className="space-y-2">
              {options.length === 0 ? (
                <p className="text-xs text-[#A8998E] italic">Loading...</p>
              ) : (
                options.map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer group/item">
                    <input
                      type="checkbox"
                      checked={selectedFilters[groupKey]?.includes(option) || false}
                      onChange={() => toggleFilter(groupKey, option)}
                      className="w-4 h-4 rounded-lg border-[#E8D5C4] text-[#FF6B35] bg-white cursor-pointer transition-all duration-150 accent-[#FF6B35]"
                    />
                    {groupKey === "modality" && getModalityIcon(option)}
                    {groupKey === "cost" && getCostIcon(option)}
                    {groupKey === "accessibility" && getAccessibilityIcon(option)}
                    <span className="text-sm text-[#555] group-hover/item:text-[#8B4513] transition-colors duration-150">
                      {option}
                    </span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </aside>
  )
}
