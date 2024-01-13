import dotenv from "dotenv"
dotenv.config()

import express, { Request, Response } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import openai from "openai"
import puppeteer from "puppeteer-core"
import { ApiError } from "./utils/ApiError"

const PORT = process.env.PORT || 5000

const app = express()

// CORS settings
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: "POST",
  credentials: true,
}
// middlewares
app.use(cors(corsOptions))
app.use(bodyParser.json())

// GET route
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is running")
})

// POST route
app.post("/url-summarize", async (req: Request, res: Response) => {
  const { url } = req.body

  try {
    const scrapedText = await scrapeUrl(url)
    const summary = await getGPTSummary(scrapedText)
    res.status(200).json({ status: 200, summary })
  } catch (error) {
    if (error instanceof ApiError) {
      res
        .status(error.statusCode)
        .json({ status: error.statusCode, error: error.message })
    } else {
      res.status(500).json({ status: 500, error: "Internal Server Error" })
    }
  }
})

async function scrapeUrl(url: string) {
  try {
    console.time("scrapeUrl")
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
    })
    const page = await browser.newPage()
    const response = await page.goto(url, { waitUntil: "domcontentloaded" })

    console.timeEnd("scrapeUrl")
    // handling situation if given url is wrong
    if (!response || response.status() !== 200) {
      throw new ApiError(400, `Error fetching content from Invaild URL.`)
    }

    const webPageContent = await page.evaluate(() => document.body.innerText)

    return webPageContent
  } catch (error) {
    console.error(`Error in scraping content from the given URL:`, error)
    // Rethrow the error as an instance of ApiError
    throw error
  }
}

async function getGPTSummary(text: string): Promise<string> {
  console.time("gpt")
  if (text.length > 4000) {
    text = text.substring(0, 4000)
  }

  const OpenAI = new openai({
    apiKey: process.env.OPENAI_API_KEY || "",
  })

  try {
    const response = await OpenAI.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that helps summarize text. Summarize the following text:",
        },
        { role: "user", content: text },
        {
          role: "assistant",
          content:
            "Provide a concise summary in 100 words. Focus on key points, omitting unnecessary details. Ensure clarity and coherence in the summary.",
        },
      ],
      temperature: 0.6,
      max_tokens: 400,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    const summary = response.choices[0]?.message?.content || ""
    console.timeEnd("gpt")
    return summary
  } catch (error) {
    console.error(`Error in getting summary from OpenAI:`, error)
    if (error.message.includes("API key")) {
      throw new ApiError(400, "Invalid or missing OpenAI API key")
    } else if (error.message.includes("Rate limit")) {
      throw new ApiError(500, "OpenAI API rate limit exceeded")
    } else {
      throw new ApiError(400, `Error in getting summary from OpenAI`)
    }
  }
}

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`)
})
