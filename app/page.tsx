"use client";

import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [concurrency, setConcurrency] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);

  const startButtonHandler = async () => {
    setIsStarted(true);
    if (results.length) {setResults([]);}
    if (concurrency === 0) {
      alert('Value cannot be 0');
      setIsStarted(false);
      return;
    }

    const concurrencyNumber = concurrency;
    const requestsPerSecond = concurrencyNumber;
    const totalRequests = 200;
    const delayBetweenRequests = 1000 / requestsPerSecond;
    const requestQueue: number[] = [];
    let activeRequests = 0;

    for (let i = 1; i <= totalRequests; i++) {
      requestQueue.push(i);
    }

    async function sendRequest() {
      if (requestQueue.length === 0) {
        return;
      }

      const requestIndex = requestQueue.shift()!;
      const response = await fetch(`/api?index=${requestIndex}`);
      if (response.status === 429) {
        const errorData = await response.json();
        setResults(prevResults => [...prevResults, `Request ${requestIndex}: ${errorData.error}`]);
      } else {
        const data = await response.json();
        setResults(prevResults => [...prevResults, `Request ${requestIndex}: ${data.index}`]);
      }

      setTimeout(sendRequest, delayBetweenRequests);
    }

    function processQueue() {
      while (activeRequests < concurrencyNumber && requestQueue.length > 0) {
        sendRequest();
        activeRequests++;
      }
    }

    processQueue();

    setTimeout(() => {
      setIsStarted(false);
    }, totalRequests * delayBetweenRequests);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h1>Test Task</h1>
      <label>
        Concurrency:
        <input
          type="number"
          min="0"
          max="100"
          style={{padding: "5px", borderRadius: "20px", marginInline: "10px"}}
          value={concurrency}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            if (!isNaN(newValue) && newValue >= 1 && newValue <= 100) {
              setConcurrency(newValue);
            }
          }}
        />
      </label>
      <button onClick={startButtonHandler} disabled={isStarted} style={{padding: "5px"}}>
        Start
      </button>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}
