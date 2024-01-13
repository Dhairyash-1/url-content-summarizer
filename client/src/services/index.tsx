export default async function getSummarizeText(url: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/url-summarize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }
  )
  const data = await response.json()
  return data
}
