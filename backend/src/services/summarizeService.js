const { GoogleGenerativeAI } = require("@google/generative-ai");
// AbortController is available globally in Node.js 15+. No need to import.
const logger = require("../utils/logger");

function createClient() {
    const config = require("../config");
    const apiKey = config.openaiApiKey;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
    }
    return new GoogleGenerativeAI(apiKey);
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

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

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
            const result = await model.generateContent(prompt, {
                signal: controller.signal,
            });
            clearTimeout(timeout);
            const summary = result.response.text().trim();
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