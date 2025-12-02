export interface Review {
  id: string
  resourceId: string
  rating: number
  reviewerName: string
  role: string
  district: string
  province: string
  date: string
  usageTags: string[]
  title?: string
  body: string
}

// Map of resource IDs to their reviews
export const reviewsData: Record<string, Review[]> = {
  // Start empty - will be populated later
}

export const getReviewsForResource = (resourceId: string): Review[] => {
  return reviewsData[resourceId] || []
}

export const addReview = (review: Review) => {
  if (!reviewsData[review.resourceId]) {
    reviewsData[review.resourceId] = []
  }
  reviewsData[review.resourceId].push(review)
}
