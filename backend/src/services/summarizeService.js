const OpenAI = require("openai");

function createClient() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not configured");
    }
    return new OpenAI({ apiKey });
}

/**
 * Summarize note content using OpenAI.
 * @param {string} title   - The note title
 * @param {string} content - The note content
 * @returns {Promise<string>} The summary text
 */
async function summarizeNote(title, content) {
    const openai = createClient();

    const textToSummarize = content?.trim();
    if (!textToSummarize) {
        throw new Error("Note has no content to summarize");
    }

    const prompt = `Summarize the following note in 2-3 concise sentences. Focus on the key points.\n\nTitle: ${title}\n\nContent:\n${textToSummarize}`;

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content:
                    "You are a helpful assistant that summarizes notes concisely. Respond only with the summary, no preamble.",
            },
            { role: "user", content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.5,
    });

    const summary = completion.choices[0]?.message?.content?.trim();
    if (!summary) {
        throw new Error("OpenAI returned an empty summary");
    }

    return summary;
}

module.exports = { summarizeNote };