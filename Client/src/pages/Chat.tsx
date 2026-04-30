import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { HubConnection } from "@microsoft/signalr";
import { createConnection } from "../lib/signalr";
import Header from "../components/layout/Header";
import Avatar from "../components/Avatar";
import { getBubbleRadius } from "../utils/chatUtils";

type Message = {
  user: string;
  text: string;
  avatar?: string;
  createdAt?: string;
  isMine?: boolean;
};

function Chat() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState("General");
  const [input, setInput] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const conn = createConnection();

    conn.start()
      .then(async () => {
        if (!isMounted) return;
        await conn.invoke("JoinRoom", "General");
        await conn.invoke("LoadRoomHistory", "General");
        setConnection(conn);
      })
      .catch(console.error);

    conn.on("ReceiveRoomMessage", (msg: Message) => {
      const currentUser = localStorage.getItem("username");
      setMessages(prev => [
        ...prev,
        { ...msg, isMine: msg.user === currentUser }
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

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    if (lastMessage.isMine || isNearBottom) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [messages]);

  const handleRoomChange = async (newRoom: string) => {
    if (!connection) return;
    setMessages([]);
    setRoom(newRoom);
    await connection.invoke("JoinRoom", newRoom);
    await connection.invoke("LoadRoomHistory", newRoom);
  };

  const handleSubmit = async () => {
    if (!input || !connection) return;
    await connection.invoke("SendRoomMessage", room, input);
    setInput("");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <div className="grid grid-cols-[280px_1fr] flex-1 min-h-0">
        
        <div className="border-r border-gray-200 overflow-y-auto">
          <div className="p-4 text-gray-500 font-bold uppercase tracking-wider text-xs">Channels</div>
          <div className="px-4 text-lg"># {room}</div>
        </div>

        <div className="p-5 flex flex-col overflow-hidden bg-gray-100">
          
          <div className="mb-4">
            <select
              className="bg-gray-800 text-white p-2 rounded-md outline-none"
              value={room}
              onChange={(e) => handleRoomChange(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Gaming">Gaming</option>
              <option value="Dev">Dev</option>
            </select>
          </div>

          <div className="shadow-sm rounded-xl flex flex-col flex-1 min-h-0 overflow-hidden">

            <div
              ref={containerRef}
              className="p-4 flex flex-col overflow-y-auto flex-1 scrollbar-thin bg-white"
            >
              <div className="flex-1" />

              {messages.map((m, i) => {
                const prev = messages[i - 1];
                const next = messages[i + 1];
                const sameAsPrev = prev?.user === m.user;
                const sameAsNext = next?.user === m.user;

                let groupPos: "single" | "first" | "middle" | "last" = "single";
                if (!sameAsPrev && sameAsNext)  groupPos = "first";
                if (sameAsPrev && sameAsNext)   groupPos = "middle";
                if (sameAsPrev && !sameAsNext)  groupPos = "last";

                const bubbleRadius = getBubbleRadius(groupPos, !!m.isMine);

                const showAvatar = groupPos === "last" || groupPos === "single";
                const marginBottom = sameAsNext ? "mb-1" : "mb-4";

                return (
                  <div
                    key={i}
                    className={`flex ${m.isMine ? "justify-end" : "justify-start"} items-end gap-3 ${marginBottom}`}
                  >
                    <div className={`flex gap-3 ${m.isMine ? "flex-row-reverse" : ""}`}>

                      <div className="w-8 h-8 flex-shrink-0">
                        {showAvatar && <Avatar name={m.user ?? "Unknown"} imageUrl={m.avatar} />}
                      </div>

                      <div className={`flex flex-col ${m.isMine ? "items-end" : "items-start"}`}>
                        {(groupPos === "first" || groupPos === "single") && (
                          <span className="text-xs text-black mb-1">{m.user}</span>
                        )}
                        <div
                          className={`px-4 py-2 text-[15px] max-w-xs break-all ${
                            m.isMine ? "bg-[#13CF13] text-white" : "bg-gray-100 text-black shadow-sm"
                          }`}
                          style={{ borderRadius: bubbleRadius }}
                        >
                          {m.text}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 border-t border-white/10 bg-white">
              <div
                contentEditable
                role="textbox"
                aria-multiline="true"
                aria-placeholder="Aa"
                onInput={(e) => {
                  const el = e.currentTarget;
                  const text = el.textContent || "";

                  if (text === "") {
                    el.innerHTML = "";
                  }

                  setInput(text);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                    e.currentTarget.textContent = "";
                  }
                }}
                className="caret-blue-500 w-full bg-gray-100 text-gray-800 font-medium text-[15px] rounded-3xl py-2 px-4 outline-none empty:before:content-[attr(aria-placeholder)] empty:before:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;

