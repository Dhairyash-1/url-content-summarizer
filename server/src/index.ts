import dotenv from "dotenv"
dotenv.config()

import express, { Request, Response } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import openai from "openai"
import puppeteer, { ElementHandle } from "puppeteer-core"
import { ApiError } from "./utils/ApiError"

const PORT = process.env.PORT || 5000

const app = express()

// CORS settings
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: "POST",
  credentials: true,
}
app.use(cors(corsOptions))
app.use(bodyParser.json())

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is running")
})

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`)
})
