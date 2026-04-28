import type { HubConnection } from "@microsoft/signalr";
import { createConnection } from "../lib/signalr";
import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import Header from "../components/layout/Header";

type Message = {
  user: string;
  text: string;
  avatar?: string;
  createdAt?: string;
  isMine?: boolean;
}

function Chat() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState("General");
  const [input, setInput] = useState("");

  useEffect(() => {
    let isMounted = true;
    const conn = createConnection();

    conn.start()
      .then(async () => {
        if (!isMounted) return;

        console.log("Connected to SignalR");

        await conn.invoke("JoinRoom", "General");
        await conn.invoke("LoadRoomHistory", "General");

        setConnection(conn);
      })
      .catch(err => console.error(err));

    conn.on("ReceiveRoomMessage", (msg: Message) => {
        const currentUser = localStorage.getItem("username");

        setMessages(prev => [
            ...prev,
            {
              ...msg,
              isMine: msg.user === currentUser
            }
        ]);
    });

    conn.on("LoadMessages", (msgs: Message[]) => {
        const currentUser = localStorage.getItem("username");

        const normalized = msgs.map(m => ({
            ...m,
            isMine: m.user?.toLowerCase() === currentUser?.toLowerCase()
        }));

        setMessages(normalized);
    });

    return () => {
      isMounted = false;

      conn.off("ReceiveRoomMessage");
      conn.off("LoadMessages");

      conn.stop();
    };
  }, []);

  const handleRoomChange = async (newRoom: string) => {
    if (!connection) return;

    setMessages([]);
    setRoom(newRoom);

    await connection.invoke("JoinRoom", newRoom);
    await connection.invoke("LoadRoomHistory", newRoom);
  };

  const sendMessage = async () => {
    if (!input || !connection) return;

    await connection.invoke("SendRoomMessage", room, input);
    setInput("");
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="flex justify-center">
        <div className="text-white w-[1000px]">
          <h1 className="text-2xl mb-4">Chat</h1>

          <div className="mb-4 flex gap-2">
            <select
              className="bg-gray-800 p-2"
              value={room}
              onChange={(e) => handleRoomChange(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Gaming">Gaming</option>
              <option value="Dev">Dev</option>
            </select>
          </div>

          <div className="mb-4 space-y-2">
            {messages.map((m, i) => (
                <div 
                    key={i} 
                    className={`flex ${m.isMine ? "justify-end" : "justify-start"} items-start gap-3`}
                >
                    <div className={`flex gap-3 ${m.isMine ? "flex-row-reverse" : ""}`}>
                        <Avatar name={m.user ?? "Unknown"} imageUrl={m.avatar} />
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-400">
                                {m.user}
                            </span>
                            <div 
                                className={`px-4 py-2 rounded-2xl max-w-xs ${m.isMine ? "bg-green-500" : "bg-gray-800"}`}>
                                {m.text}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="p-2 bg-gray-800 flex-1"
            />
            <button
              onClick={sendMessage}
              disabled={!input}
              className="bg-green-500 px-4 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;