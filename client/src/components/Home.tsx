import { SyntheticEvent, useState } from "react"
import getSummarizeText from "../services"
import Loader from "./Loader"
import ErrorMsg from "./ErrorMsg"

export default function Home() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [summary, setSummary] = useState("")

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    try {
      setError("")
      setIsLoading(true)
      const response = await getSummarizeText(url)
      console.log(response)
      if (response.status !== 200) {
        throw new Error(response.error)
      }
      setSummary(response.summary)
    } catch (error) {
      console.error(error)
      setError(error.message)
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

      {/* {isLoading ? (
        <Loader message={"Summarizing. Please wait..."} />
      ) : (
        summary && (
          <div className="summary-area">
            <h3>Summary:</h3>
            <p>{summary}</p>
          </div>
        )
      )} */}

      {isLoading && <Loader message={"Summarizing. Please wait..."} />}
      {error && <ErrorMsg message={error} />}
      {summary && (
        <div className="summary-area">
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </main>
  )
}
