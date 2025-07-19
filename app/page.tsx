"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./page.module.css";

interface Message {
  sender: "user" | "bot";
  text: string;
}

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

export default function Home() {
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      // Split bot response into paragraphs, add each as a separate message
      const paragraphs = (data.text || "").split(/\n\s*\n/).filter(Boolean);
      setMessages((msgs) => [
        ...msgs,
        ...paragraphs.map((p: string) => ({ sender: "bot" as const, text: p })),
      ]);
    } catch (e) {
      setMessages((msgs) => [...msgs, { sender: "bot", text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className={styles.chatbotContainer}>
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
          <div className={`${styles.message} ${styles.bot}`}>...</div>
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
