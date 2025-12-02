import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

interface Resource {
  province: string
  grade: string
  topic: string
  title: string
  description: string
  curriculum_expectations: string[]
  resource_type: string
  accessibility_rating: string
  year_published: number
  publisher: string
  is_paid: boolean
  url: string
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "resources.json")
    console.log("[v0] API: Reading from:", filePath)
    
    if (!fs.existsSync(filePath)) {
      console.error("[v0] API: File does not exist at:", filePath)
      return NextResponse.json({ 
        error: "Resources file not found", 
        resources: [] 
      }, { status: 500 })
    }

    const fileContents = fs.readFileSync(filePath, "utf-8")
    const data: Resource[] = JSON.parse(fileContents)
    
    console.log("[v0] API: Successfully loaded", data.length, "resources")
    console.log("[v0] API: First resource:", data[0])

    return NextResponse.json({ resources: data })
    
  } catch (error) {
    console.error("[v0] API: Caught error:", error)
    return NextResponse.json({ 
      error: "Failed to load resources", 
      resources: [] 
    }, { status: 500 })
  }
}
