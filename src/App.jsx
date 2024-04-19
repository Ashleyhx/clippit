import { useState } from 'react';
import './App.css';
import axios from 'axios';
import pdfToText from 'react-pdftotext';

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
            const response = await axios.post('/api/ask', { question, documentText: pdfText });
            setAnswer(response.data.answer);
        } catch (error) {
            setAnswer('There was an error processing your question.');
            console.error('Error asking question:', error);
        }
        setIsLoading(false);
    };

    return (
        <>
            <div>
                <input type="file" accept="application/pdf" onChange={extractText}/>
                {isLoading && <p>Loading PDF...</p>}
            </div>

            <div className="chat-interface">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about the PDF"
                />
                <button onClick={askQuestion} disabled={isLoading}>
                    Ask
                </button>
                <p>Answer: {isLoading ? 'Loading...' : answer}</p>
            </div>

        </>
    );
}

export default App;
