import { SyntheticEvent, useState } from "react"
import getSummarizeText from "../services"
import Loader from "./Loader"

export default function Home() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState("")

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    try {
      setIsLoading(true)
      const summary = await getSummarizeText(url)
      console.log(summary)
      setSummary(summary)
    } catch (error) {
      console.log(`Error in posting url to server, ${error}`)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <main>
      <h2>Summarize text from any URL</h2>

      <form onSubmit={handleSubmit}>
        <input
          disabled={isLoading}
          type="text"
          placeholder="Enter the url here..."
          name="url"
          onChange={e => setUrl(e.target.value)}
        />
        <button
          disabled={isLoading}
          className={`btn ${isLoading ? "loading" : ""}`}
        >
          {isLoading ? "Summarizing..." : "Summarize"}
        </button>
      </form>

      {isLoading ? (
        <Loader message={"Summarizing. Please wait..."} />
      ) : (
        summary && (
          <div className="summary-area">
            <h3>Summary:</h3>
            <p>{summary}</p>
          </div>
        )
      )}
    </main>
  )
}
