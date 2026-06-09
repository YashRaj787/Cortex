const { GoogleGenerativeAI } = require("@google/generative-ai");

function createClient() {
    const apiKey = process.env.GEMINI_API_KEY;
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
    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();
    if (!summary) {
        throw new Error("Gemini returned an empty summary");
    }

    return summary;
}

module.exports = { summarizeNote };