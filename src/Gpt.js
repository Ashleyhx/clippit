import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const organization = import.meta.env.VITE_OPENAI_ORGANIZATION;
const project = import.meta.env.VITE_OPENAI_PROJECT;

const openai = new OpenAI({
    apiKey: apiKey,
    organization: organization,
    project: project,
    dangerouslyAllowBrowser: true });

const getPrompt = (question, content) => {
    const prompt = `Task:Generate Answer for question provided based on content.
Content:
${JSON.stringify(content)}

The question is:
${question}"
`;
    return prompt;
};

const getGPTAnswer = async (question, content) => {
    const prompt = getPrompt(question, content);
    console.log("Prompt is", prompt);
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });
        console.log("Response is", response);
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Failed to generate answer", error);
    }
}

export default getGPTAnswer;
