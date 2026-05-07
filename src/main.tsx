import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BookmarksProvider } from "@/lib/bookmarks-context"
import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BookmarksProvider>
      <App />
    </BookmarksProvider>
  </StrictMode>,
)
