"use client"
import { Settings, Globe, ChevronDown, Bookmark, School } from "lucide-react"
import type { Filters } from "@/lib/types"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import BookmarksModal from "@/components/bookmarks-modal"
import SettingsModal from "@/components/settings-modal"
import { useBookmarks } from "@/lib/bookmarks-context"

const EDTECH_SUBSCRIPTIONS = [
  { id: "edwin", name: "Edwin" },
  { id: "knowledgehook", name: "Knowledgehook" },
  { id: "amira", name: "Amira" },
  { id: "myon", name: "MyON" },
]

interface SearchHeaderProps {
  filters: Filters
  setFilters: (filters: Filters) => void
}

const PROVINCES = [
  { code: "", name: "Canada (All)" },
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
]

const SCHOOL_DISTRICTS = [
  { code: "", name: "All Districts" },
  { code: "TDSB", name: "Toronto DSB" },
  { code: "YRDSB", name: "York Region DSB" },
  { code: "DDSB", name: "Durham DSB" },
  { code: "PDSB", name: "Peel DSB" },
  { code: "TVDSB", name: "TVDSB" }, // Added TVDSB to the list of school districts
]

const AVAILABLE_GRADES = ["6", "7", "8", "9"]
const AVAILABLE_SUBJECTS = ["Math", "Science", "Language", "Social Studies"]

const SUBJECT_STRANDS: Record<string, string[]> = {
  Math: ["Probability", "Data Literacy", "Financial Literacy"],
  Science: ["Earth and Space Systems", "Life Systems", "Matter and Energy"],
  Language: ["Media Literacy", "Writing", "Reading", "Oral Communication"],
  "Social Studies": ["Heritage and Identity", "People and Environments", "Power and Governance"],
}

export default function SearchHeader({ filters, setFilters }: SearchHeaderProps) {
  const { bookmarkedResources } = useBookmarks()

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [language, setLanguage] = useState<"EN" | "FR">("EN")
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([])
  const [isBookmarksModalOpen, setIsBookmarksModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const gradeDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (filters.grade) {
      setSelectedGrades(filters.grade.split(","))
    } else {
      setSelectedGrades([])
    }
  }, [filters.grade])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gradeDropdownRef.current && !gradeDropdownRef.current.contains(event.target as Node)) {
        if (openDropdown === "grade") {
          setOpenDropdown(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdown])

  const handleProvinceChange = (code: string) => {
    setFilters({ ...filters, province: code })
    setOpenDropdown(null)
  }

  const handleGradeToggle = (grade: string) => {
    const newSelected = selectedGrades.includes(grade)
      ? selectedGrades.filter((g) => g !== grade)
      : [...selectedGrades, grade]

    setSelectedGrades(newSelected)
    setFilters({ ...filters, grade: newSelected.join(",") })
  }

  const handleFilterChange = (key: keyof Filters, value: string) => {
    if (key === "subject") {
      // When subject changes, clear the strand selection
      setFilters({ ...filters, subject: value, strand: "" })
    } else {
      setFilters({ ...filters, [key]: value })
    }
    setOpenDropdown(null)
  }

  const handleDistrictChange = (code: string) => {
    setSelectedDistrict(code)
    setOpenDropdown(null)
  }

  const handleSubscriptionToggle = (subId: string) => {
    setSelectedSubscriptions((prev) => (prev.includes(subId) ? prev.filter((s) => s !== subId) : [...prev, subId]))
  }

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const currentProvince = PROVINCES.find((p) => p.code === filters.province) || PROVINCES[0]
  const provinceAbbr = currentProvince.code === "" ? "CA" : currentProvince.code

  const currentDistrict = SCHOOL_DISTRICTS.find((d) => d.code === selectedDistrict) || SCHOOL_DISTRICTS[0]
  const districtAbbr = currentDistrict.code === "" ? "DSB" : currentDistrict.code

  const GradeDropdown = () => {
    const isOpen = openDropdown === "grade"
    let displayValue = "All Grades"
    if (selectedGrades.length > 0) {
      // Sort grades in ascending order
      const sortedGrades = [...selectedGrades].sort((a, b) => Number(a) - Number(b))

      if (sortedGrades.length === 1) {
        displayValue = `Grade ${sortedGrades[0]}`
      } else if (sortedGrades.length === 2) {
        displayValue = `Grades: ${sortedGrades[0]} & ${sortedGrades[1]}`
      } else {
        // Three or more grades
        const lastGrade = sortedGrades[sortedGrades.length - 1]
        const otherGrades = sortedGrades.slice(0, -1).join(", ")
        displayValue = `Grades: ${otherGrades} & ${lastGrade}`
      }
    }

    return (
      <div ref={gradeDropdownRef} className="w-40 flex-shrink-0 px-3 py-2 relative">
        <button onClick={() => toggleDropdown("grade")} className="w-full text-left">
          <p className="text-xs font-semibold text-[#333]">Grade</p>
          <div className="flex items-center justify-between">
            <p
              className={`text-sm font-medium truncate pr-1 ${selectedGrades.length > 0 ? "text-[#333]" : "text-[#999]"}`}
            >
              {displayValue}
            </p>
            <ChevronDown size={16} className="text-[#999] flex-shrink-0" />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 min-w-full mt-2 bg-white rounded-2xl shadow-lg border border-[#E8D5C4] z-50">
            <div className="max-h-60 overflow-y-auto">
              {AVAILABLE_GRADES.map((grade) => {
                const isSelected = selectedGrades.includes(grade)
                return (
                  <button
                    key={grade}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGradeToggle(grade)
                    }}
                    className={`w-full text-left px-4 py-3 transition-colors duration-150 border-b border-[#F0E8E0] last:border-b-0 flex items-center justify-between ${
                      isSelected ? "bg-[#FFE5CC]" : "hover:bg-[#FFF5ED]"
                    }`}
                  >
                    <p className="text-sm text-[#2C2C2C]">Grade {grade}</p>
                    {isSelected && <span className="text-[#8B4513] font-bold">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  const SubjectDropdown = () => {
    const isOpen = openDropdown === "subject"
    const displayValue = filters.subject || "All Subjects"

    return (
      <div className="w-40 flex-shrink-0 px-3 py-2 relative">
        <button onClick={() => toggleDropdown("subject")} className="w-full text-left">
          <p className="text-xs font-semibold text-[#333]">Subject</p>
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${filters.subject ? "text-[#333]" : "text-[#999]"}`}>{displayValue}</p>
            <ChevronDown size={16} className="text-[#999]" />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 min-w-full mt-2 bg-white rounded-2xl shadow-lg border border-[#E8D5C4] z-50">
            <div className="max-h-60 overflow-y-auto">
              <button
                onClick={() => handleFilterChange("subject", "")}
                className={`w-full text-left px-4 py-3 transition-colors duration-150 border-b border-[#F0E8E0] ${
                  !filters.subject ? "bg-[#FFE5CC]" : "hover:bg-[#FFF5ED]"
                }`}
              >
                <p className="text-sm text-[#2C2C2C]">All Subjects</p>
              </button>
              {AVAILABLE_SUBJECTS.map((subject, idx) => {
                const isSelected = filters.subject === subject
                return (
                  <button
                    key={idx}
                    onClick={() => handleFilterChange("subject", subject)}
                    className={`w-full text-left px-4 py-3 transition-colors duration-150 border-b border-[#F0E8E0] last:border-b-0 ${
                      isSelected ? "bg-[#FFE5CC]" : "hover:bg-[#FFF5ED]"
                    }`}
                  >
                    <p className="text-sm text-[#2C2C2C]">{subject}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  const StrandDropdown = () => {
    const isOpen = openDropdown === "strand"
    const isDisabled = !filters.subject // Disabled when no subject selected
    const availableStrands = filters.subject ? SUBJECT_STRANDS[filters.subject] || [] : []
    const displayValue = filters.strand || "All Strands"

    return (
      <div className="w-44 flex-shrink-0 px-3 py-2 relative">
        <button
          onClick={() => !isDisabled && toggleDropdown("strand")}
          className={`w-full text-left ${isDisabled ? "cursor-not-allowed" : ""}`}
          disabled={isDisabled}
        >
          <p className={`text-xs font-semibold ${isDisabled ? "text-[#999]" : "text-[#333]"}`}>Strand</p>
          <div className="flex items-center justify-between">
            <p
              className={`text-sm font-medium ${isDisabled ? "text-[#CCC]" : filters.strand ? "text-[#333]" : "text-[#999]"}`}
            >
              {isDisabled ? "Select Subject First" : displayValue}
            </p>
            <ChevronDown size={16} className={isDisabled ? "text-[#CCC]" : "text-[#999]"} />
          </div>
        </button>

        {isOpen && !isDisabled && (
          <div className="absolute top-full left-0 min-w-full mt-2 bg-white rounded-2xl shadow-lg border border-[#E8D5C4] z-50">
            <div className="max-h-60 overflow-y-auto">
              <button
                onClick={() => handleFilterChange("strand", "")}
                className={`w-full text-left px-4 py-3 transition-colors duration-150 border-b border-[#F0E8E0] ${
                  !filters.strand ? "bg-[#FFE5CC]" : "hover:bg-[#FFF5ED]"
                }`}
              >
                <p className="text-sm text-[#2C2C2C]">All Strands</p>
              </button>
              {availableStrands.map((strand, idx) => {
                const isSelected = filters.strand === strand
                return (
                  <button
                    key={idx}
                    onClick={() => handleFilterChange("strand", strand)}
                    className={`w-full text-left px-4 py-3 transition-colors duration-150 border-b border-[#F0E8E0] last:border-b-0 ${
                      isSelected ? "bg-[#FFE5CC]" : "hover:bg-[#FFF5ED]"
                    }`}
                  >
                    <p className="text-sm text-[#2C2C2C]">{strand}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  const handleClearFilters = () => {
    setFilters({
      province: "",
      grade: "",
      subject: "",
      strand: "",
      topic: "",
      learningType: "",
    })
    setSelectedGrades([])
    setSelectedDistrict("")
    setSelectedSubscriptions([]) // Clear selected subscriptions
    setOpenDropdown(null)
  }

  const hasActiveFilters =
    (filters.province && filters.province !== "") ||
    (filters.grade && filters.grade !== "") ||
    (filters.subject && filters.subject !== "") ||
    (filters.strand && filters.strand !== "")

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FAF3E0] shadow-lg border-[#E8D5C4]">
        <div className="max-w-[1500px] mx-auto px-6 py-3">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
            <div className="flex items-center">
              <Image
                src="/Maple_Key_Transp_Background.png"
                alt="Maple Key Logo"
                width={160}
                height={56}
                className="w-auto object-contain h-20"
                priority
              />
            </div>

            <div className="flex justify-center">
              <div className="flex items-center bg-white border-2 border-[#E8D5C4] rounded-2xl shadow-lg max-w-[650px]">
                <GradeDropdown />
                <div className="w-px h-10 bg-[#E8D5C4] flex-shrink-0"></div>
                <SubjectDropdown />
                <div className="w-px h-10 bg-[#E8D5C4] flex-shrink-0"></div>
                <StrandDropdown />

                <div className="w-20 flex-shrink-0 px-2 py-1 ml-1">
                  <button
                    onClick={handleClearFilters}
                    className={`w-full text-center text-xs font-semibold text-white bg-[#C65D3B] hover:bg-[#8B1A1A] hover:shadow-lg rounded-lg px-3 py-2 transition-opacity duration-150 ${
                      hasActiveFilters ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    title="Clear all filters"
                    disabled={!hasActiveFilters}
                  >
                    <div className="leading-tight">Clear</div>
                    <div className="leading-tight">Filters</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("district")}
                  className="flex items-center gap-2 px-3 py-1.5 min-h-[40px] min-w-[80px] bg-white rounded-xl border-2 border-[#8B4513] hover:bg-[#FFE5CC] transition-all duration-200 shadow-sm"
                  title="Select School District"
                >
                  <School size={20} className="text-[#8B4513] flex-shrink-0" />
                  <span className="text-sm font-bold text-[#8B4513]">{districtAbbr}</span>
                </button>
                {openDropdown === "district" && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-[#E8D5C4] z-50">
                    <div className="max-h-72 overflow-y-auto">
                      {SCHOOL_DISTRICTS.map((district, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleDistrictChange(district.code)}
                          className={`w-full text-left px-4 py-3 transition-colors duration-150 border-b border-[#F0E8E0] last:border-b-0 ${
                            selectedDistrict === district.code ? "bg-[#FFE5CC]" : "hover:bg-[#FFF5ED]"
                          }`}
                        >
                          <p className="text-sm text-[#2C2C2C]">{district.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("province")}
                  className="flex items-center gap-2 px-3 py-1.5 min-h-[40px] min-w-[72px] bg-white rounded-xl border-2 border-[#8B4513] hover:bg-[#FFE5CC] transition-all duration-200 shadow-sm"
                  title="Select Province"
                >
                  <Globe size={20} className="text-[#8B4513] flex-shrink-0" />
                  <span className="text-sm font-bold text-[#8B4513]">{provinceAbbr}</span>
                </button>
                {openDropdown === "province" && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-[#E8D5C4] z-50">
                    <div className="max-h-72 overflow-y-auto">
                      {PROVINCES.map((province, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleProvinceChange(province.code)}
                          className={`w-full text-left px-4 py-3 transition-colors duration-150 border-b border-[#F0E8E0] last:border-b-0 ${
                            filters.province === province.code ? "bg-[#FFE5CC]" : "hover:bg-[#FFF5ED]"
                          }`}
                        >
                          <p className="text-sm text-[#2C2C2C]">{province.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("subscriptions")}
                  className="flex items-center gap-2 px-3 py-1.5 min-h-[40px] min-w-[72px] bg-white rounded-xl border-2 border-[#8B4513] hover:bg-[#FFE5CC] transition-all duration-200 shadow-sm"
                  title="EdTech Subscriptions"
                >
                  <span className="text-sm font-bold text-[#8B4513]">SUBS</span>
                  <ChevronDown size={16} className="text-[#8B4513]" />
                </button>
                {openDropdown === "subscriptions" && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-[#E8D5C4] z-50">
                    <div className="p-2">
                      {EDTECH_SUBSCRIPTIONS.map((sub) => {
                        const isSelected = selectedSubscriptions.includes(sub.id)
                        return (
                          <button
                            key={sub.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSubscriptionToggle(sub.id)
                            }}
                            className={`w-full text-left px-4 py-3 transition-colors duration-150 rounded-lg mb-1 flex items-center gap-3 ${
                              isSelected ? "bg-[#FFE5CC]" : "hover:bg-[#FFF5ED]"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                isSelected ? "bg-[#8B4513] border-[#8B4513]" : "border-[#8B4513]"
                              }`}
                            >
                              {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                            </div>
                            <p className="text-sm text-[#2C2C2C]">{sub.name}</p>
                          </button>
                        )
                      })}
                      <div className="border-t border-[#E8D5C4] mt-2 pt-2">
                        <button
                          onClick={() => {}}
                          className="w-full text-center px-4 py-2 text-sm font-medium text-[#8B4513] hover:bg-[#FFF5ED] rounded-lg transition-colors duration-150"
                        >
                          More...
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsBookmarksModalOpen(true)}
                className="relative p-2 min-h-[40px] min-w-[40px] hover:bg-[#FFE5CC] rounded-full transition-all duration-200"
                title="Saved Resources"
              >
                <Bookmark
                  size={20}
                  className={`flex-shrink-0 ${bookmarkedResources.length > 0 ? "text-[#FF6B35]" : "text-[#8B4513]"}`}
                />
                {bookmarkedResources.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B35] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {bookmarkedResources.length >= 10 ? "9+" : bookmarkedResources.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 min-h-[40px] min-w-[40px] hover:bg-[#FFE5CC] rounded-full transition-all duration-200"
                title="Settings"
              >
                <Settings size={20} className="text-[#8B4513] flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <BookmarksModal isOpen={isBookmarksModalOpen} onClose={() => setIsBookmarksModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </>
  )
}
