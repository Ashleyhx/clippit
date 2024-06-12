import { CohereClient } from 'cohere-ai';

const createCohereClient = (apiKey) => {
    return new CohereClient({
        token: apiKey,
    });
};

const getCohereAnswer = async (cohere, question, content) => {
    try {
        const response = await cohere.chat({
            chatHistory: [
                { role: 'USER', message: `Context: ${content}` },
                { role: 'USER', message: question },
            ],
            message: question,
            connectors: [{ id: 'web-search' }],
        });

        console.log('Response is', response);
        return response.text;
    } catch (error) {
        console.error('Failed to generate answer', error);
    }
};

export { createCohereClient, getCohereAnswer };

