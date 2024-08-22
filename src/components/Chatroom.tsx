"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";

const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8080"; // Fallback URL

export default function ChatRoom() {
  const [messages, setMessages] = useState<
    { username: string; content: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const router = useRouter();
  const username =
    typeof window !== "undefined" ? localStorage.getItem("username") : "Guest";

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : ""; // Get token from local storage

    if (!token || !username) {
      router.push("/sign-in"); // Redirect to sign-in page if token or username is not available
      return;
    }

    const socketConnection = io(`${backendUrl}`, {
      auth: {
        token: token,
      },
      transports: ["websocket"],
    });

    socketConnection.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setConnectionError(true); // Set error state on connection error
      socketConnection.disconnect(); // Disconnect the socket on error
      router.push("/sign-in");
    });

    // Handle receiving message history
    socketConnection.on(
      "messageHistory",
      (history: { username: string; content: string }[]) => {
        setMessages(history);
      }
    );

    // Handle receiving new messages
    socketConnection.on(
      "message",
      (message: { username: string; content: string }) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    );

    setSocket(socketConnection);

    socketConnection.connect();
    return () => {
      socketConnection.off("message");
      socketConnection.disconnect();
    };
  }, [router]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageData = { username, content: newMessage };
      socket.emit("message", messageData);
      setNewMessage("");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
    router.push("/sign-in");
  };

  if (connectionError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">
          Connection error. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat Room</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </header>
      <main className="flex-1 p-4 overflow-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
              <p>
                <strong>{msg.username}:</strong> {msg.content}
              </p>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-l-lg"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
