import {useEffect, useState} from 'react';
import {Button, FileInput, Stack, TextInput} from '@mantine/core';
import './App.css';
import pdfToText from 'react-pdftotext';
import {createOpenAIClient, getGPTAnswer} from "./Gpt.js";
import Markdown from "react-markdown";


function App() {
    const [apiKey, setApiKey] = useState(''); // State to store the API key
    const [openAI, setOpenAI] = useState(null); // State to store the OpenAI client
    useEffect(() => {
        if (apiKey) {
            setOpenAI(createOpenAIClient(apiKey));
        }
    }, [apiKey]);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pdfText, setPdfText] = useState(''); // State to store extracted text from PDF

    const extractText = (file) => {
        setIsLoading(true);
        pdfToText(file)
            .then(text => {
                setPdfText(text);
                console.log("Text is", text);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Failed to extract text from PDF", error);
                setIsLoading(false);
            });
    };

    const askQuestion = async () => {
        if (!pdfText) {
            alert("Please upload a PDF and wait for it to be processed before asking a question.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await getGPTAnswer(openAI, question, pdfText);
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
            <TextInput
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                description="The OpenAI API key is used to generate queries from questions using GPT-3.5.
            It can be obtained from 'https://platform.openai.com/'. The API key is only stored in your browser."
                placeholder="enter your OpenAI Api key here"
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
