import { useState } from "react";
import axios from "axios";

const AIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await axios.post("http://localhost:5000/api/ai/chat", { message: input });
      const aiMessage = { sender: "ai", text: res.data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat error:", err);
    }

    setInput("");
  };

  return (
    <div className="p-4 border rounded w-full max-w-md mx-auto">
      <div className="h-80 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={`text-sm ${msg.sender === 'user' ? 'text-right' : 'text-left text-blue-500'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border flex-1 p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI anything..."
        />
        <button className="bg-blue-600 text-white px-4" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AIChatbot;
