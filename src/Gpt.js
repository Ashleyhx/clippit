import OpenAI from "openai";

const getPrompt = (question, content) => {
    return `Task:Generate Answer for question provided based on content. Format your response in GitHub-favored markdown.
Content:
${JSON.stringify(content)}

The question is:
${question}"
`;
};

const createOpenAIClient = (apiKey) => {
    return new OpenAI({
        apiKey: apiKey,
        // organization: organization,
        // project: project,
        dangerouslyAllowBrowser: true
    });

}

const getGPTAnswer = async (openai, question, content) => {
    const prompt = getPrompt(question, content);
    console.log("Prompt is", prompt);
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}],
        });
        console.log("Response is", response);
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Failed to generate answer", error);
    }
}

export {createOpenAIClient, getGPTAnswer};
