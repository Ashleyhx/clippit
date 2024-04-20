import { useState } from 'react';
import {createTheme, FileInput, MantineProvider} from '@mantine/core';
import './App.css';
import pdfToText from 'react-pdftotext';
import getGPTAnswer from "./Gpt.js";
import { Button } from '@mantine/core';

function Demo() {
    return (
        <FileInput
            variant="filled"
            size="lg"
            radius="xl"
            label="Input label"
            description="Input description"
            placeholder="Input placeholder"
        />
    );
}


function App() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pdfText, setPdfText] = useState(''); // State to store extracted text from PDF

    const extractText = (event) => {
        const file = event.target.files[0];
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
            const response = await getGPTAnswer(question, pdfText);
            console.log("====================================");
            console.log("Response is", response);
            setAnswer(response);
        } catch (error) {
            setAnswer('There was an error processing your question.');
            console.error('Error asking question:', error);
        }
        setIsLoading(false);
    };

    return (
        <MantineProvider>
            {/* The rest of your app */}
            <FileInput
                variant="filled"
                size="lg"
                radius="xl"
                label="Upload your PDF"
                placeholder="Drag your PDF here or click to upload"
                accept=".pdf"
                onChange={(event) => handleFileChange(event.currentTarget.files[0])}
                disabled={isLoading}
            />

            <div className="chat-interface">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about the PDF"
                />
                <Button onClick={askQuestion} disabled={isLoading}>
                    Ask
                </Button>
                <p>Answer: {isLoading ? 'Loading...' : answer}</p>
            </div>
        </MantineProvider>
    );
}

export default App;
