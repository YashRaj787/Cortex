// Removed Gemini SDK import
const { OpenAI } = require("openai");
// AbortController is available globally in Node.js 15+. No need to import.
const logger = require("../utils/logger");

function createClient() {
    const config = require("../config");
    const apiKey = config.nimApiKey;
    if (!apiKey) {
        throw new Error("NIM_API_KEY is not configured");
    }
    // OpenAI client configured for NVIDIA NIM endpoint
    return new OpenAI({
        apiKey,
        baseURL: "https://integrate.api.nvidia.com/v1",
    });
}

/**
 * Summarize note content using Google Gemini.
 * @param {string} title   - The note title
 * @param {string} content - The note content
 * @returns {Promise<string>} The summary text
 */
async function summarizeNote(title, content) {
    const genAI = createClient();
    const textToSummarize = content?.trim();
    if (!textToSummarize) {
        throw new Error("Note has no content to summarize");
    }

    const prompt = `Summarize the following note in 2-3 concise sentences. Focus on the key points.\n\nTitle: ${title}\n\nContent:\n${textToSummarize}`;

    // Use NVIDIA NIM model
    const model = genAI; // OpenAI client itself will be used for chat completions

    // Retry policy: maximum 2 retries for transient failures
    const maxRetries = 2;
    let attempt = 0;
    let lastError;
    while (attempt <= maxRetries) {
        try {
            // Timeout implementation: 15 seconds
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                controller.abort();
            }, 15000);
            const chatResponse = await model.chat.completions.create({
                model: "openai/gpt-oss-20b",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                signal: controller.signal,
            });
            clearTimeout(timeout);
            const summary = chatResponse.choices[0].message.content.trim();
            if (!summary) {
                throw new Error("Gemini returned an empty summary");
            }
            return summary;
        } catch (err) {
            lastError = err;
            // Determine if retryable
            const isNetworkError = err.code === "ECONNRESET" || err.code === "ETIMEDOUT" || err.code === "EAI_AGAIN";
            const is429 = err.response?.status === 429;
            const is5xx = err.response?.status >= 500 && err.response?.status < 600;
            const isAbort = err.name === "AbortError";
            if (isAbort) {
                // Timeout: do not retry, throw timeout error
                const timeoutError = new Error("AI request timed out");
                timeoutError.statusCode = 504;
                throw timeoutError;
            }
            if ((isNetworkError || is429 || is5xx) && attempt < maxRetries) {
                attempt++;
                logger.warn({ msg: "Retrying AI request", attempt, error: err.message });
                continue;
            }
            // Non-retryable error
            throw err;
        }
    }
    // If we exit loop without returning, throw last error
    throw lastError;
}

module.exports = { summarizeNote };