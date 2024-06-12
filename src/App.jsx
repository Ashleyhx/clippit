import { useEffect, useState } from 'react';
import { Button, FileInput, Stack, TextInput, Select } from '@mantine/core';
import './App.css';
import pdfToText from 'react-pdftotext';
import { createOpenAIClient, getGPTAnswer } from './Gpt.js';
import { createCohereClient, getCohereAnswer } from './CohereAi.js';
import Markdown from 'react-markdown';

function App() {
    const [apiKey, setApiKey] = useState(''); // State to store the API key
    const [apiService, setApiService] = useState('openai'); // State to store the selected API service
    const [openAI, setOpenAI] = useState(null); // State to store the OpenAI client
    const [cohere, setCohere] = useState(null); // State to store the Cohere client
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pdfText, setPdfText] = useState(''); // State to store extracted text from PDF

    useEffect(() => {
        if (apiKey) {
            if (apiService === 'openai') {
                setOpenAI(createOpenAIClient(apiKey));
                setCohere(null); // Reset cohere client
            } else if (apiService === 'cohere') {
                setCohere(createCohereClient(apiKey));
                setOpenAI(null); // Reset openai client
            }
        }
    }, [apiKey, apiService]);

    const extractText = (file) => {
        setIsLoading(true);
        pdfToText(file)
            .then((text) => {
                setPdfText(text);
                console.log('Text is', text);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Failed to extract text from PDF', error);
                setIsLoading(false);
            });
    };

    const askQuestion = async () => {
        if (!pdfText) {
            alert('Please upload a PDF and wait for it to be processed before asking a question.');
            return;
        }

        setIsLoading(true);
        try {
            let response;
            if (apiService === 'openai') {
                response = await getGPTAnswer(openAI, question, pdfText);
            } else if (apiService === 'cohere') {
                response = await getCohereAnswer(cohere, question, pdfText);
            }
            setAnswer(response);
        } catch (error) {
            setAnswer('There was an error processing your question.');
            console.error('Error asking question:', error);
        }
        setIsLoading(false);
    };

    return (
        <Stack>
            <h1>PDF Parser</h1>
            <Select
                label="Select API Service"
                placeholder="Pick one"
                value={apiService}
                onChange={setApiService}
                data={[
                    { value: 'openai', label: 'OpenAI' },
                    { value: 'cohere', label: 'CohereAI' },
                ]}
            />
            <TextInput
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                description="Enter your API key. The key is stored only in your browser."
                placeholder="Enter your API key here"
            />
            <FileInput
                variant="filled"
                size="lg"
                radius="xl"
                label="Upload your PDF"
                placeholder="Drag your PDF here or click to upload"
                accept=".pdf"
                onChange={(file) => extractText(file)}
                disabled={isLoading}
            />
            <TextInput
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the PDF"
            />
            <Button onClick={askQuestion} disabled={isLoading}>
                Ask
            </Button>
            <Markdown>{isLoading ? 'Loading...' : answer}</Markdown>
        </Stack>
    );
}

export default App;

