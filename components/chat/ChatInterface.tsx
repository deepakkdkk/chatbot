"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./ChatInterface.module.css";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatInterfaceProps {
  className?: string;
}

export function ChatInterface({ className = "" }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { sender: "user" as const, text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Add initial bot message for streaming
      setMessages((msgs) => [...msgs, { sender: "bot", text: "" }]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, stream: true }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedText = "";
      let hasReceivedData = false;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              // Stream completed
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                hasReceivedData = true;
                accumulatedText += parsed.text;
                // Update the last bot message with accumulated text
                setMessages((msgs) => {
                  const newMsgs = [...msgs];
                  const lastMsg = newMsgs[newMsgs.length - 1];
                  if (lastMsg && lastMsg.sender === "bot") {
                    lastMsg.text = accumulatedText;
                  }
                  return newMsgs;
                });
              }
            } catch (e) {
              console.error('Error parsing stream data:', e);
            }
          }
        }
      }

      // If no streaming data was received, fallback to non-streaming
      if (!hasReceivedData) {
        console.log('Streaming failed, falling back to non-streaming API');
        const fallbackResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: input, stream: false }),
        });
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          const text = data.text || "";
          const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
          
          setMessages((msgs) => {
            const newMsgs = msgs.slice(0, -1); // Remove the last bot message
            return [...newMsgs, ...paragraphs.map((p: string) => ({ sender: "bot" as const, text: p }))];
          });
        } else {
          throw new Error('Fallback API also failed');
        }
      } else {
        // Split the final accumulated text into paragraphs if needed
        if (accumulatedText) {
          const paragraphs = accumulatedText.split(/\n\s*\n/).filter(Boolean);
          if (paragraphs.length > 1) {
            setMessages((msgs) => {
              const newMsgs = msgs.slice(0, -1); // Remove the last bot message
              return [...newMsgs, ...paragraphs.map((p: string) => ({ sender: "bot" as const, text: p }))];
            });
          }
        }
      }

    } catch (e) {
      console.error('Error:', e);
      setMessages((msgs) => {
        const newMsgs = msgs.slice(0, -1); // Remove the last bot message
        return [...newMsgs, { sender: "bot", text: "Sorry, something went wrong." }];
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  function renderBotMessage(text: string, idx: number) {
    // Detect markdown-style bullets or numbered lists
    const lines = text.split(/\n|(?=\d+\. )/g).filter(Boolean);
    const isBullet = lines.some((l) => l.trim().startsWith("* "));
    const isNumbered = lines.some((l) => /^\d+\. /.test(l.trim()));

    if (isBullet) {
      return (
        <ul key={idx} style={{ margin: 0, paddingLeft: 20 }}>
          {lines.map((l, i) =>
            l.trim().startsWith("* ") ? (
              <li key={i}>{l.trim().replace(/^\*\s+/, "")}</li>
            ) : null
          )}
        </ul>
      );
    }
    if (isNumbered) {
      return (
        <ol key={idx} style={{ margin: 0, paddingLeft: 20 }}>
          {lines.map((l, i) =>
            /^\d+\. /.test(l.trim()) ? (
              <li key={i}>{l.trim().replace(/^\d+\.\s+/, "")}</li>
            ) : null
          )}
        </ol>
      );
    }
    return <div key={idx} className={`${styles.message} ${styles.bot}`}>{text}</div>;
  }

  return (
    <div className={`${styles.chatbotContainer} ${className}`}>
      <div className={styles.chatHeader}>Chatbot</div>
      <div className={styles.chatMessages}>
        {messages.map((msg, idx) =>
          msg.sender === "bot"
            ? renderBotMessage(msg.text, idx)
            : (
                <div
                  key={idx}
                  className={`${styles.message} ${styles.user}`}
                >
                  {msg.text}
                </div>
              )
        )}
        {loading && (
          <div className={`${styles.message} ${styles.bot}`}>
            {messages[messages.length - 1]?.sender === "bot" && 
             messages[messages.length - 1]?.text === "" ? (
              <span>
                Thinking<span className={styles.streamingIndicator}></span>
              </span>
            ) : ""}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <input
          className={styles.input}
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button className={styles.sendButton} onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
} 