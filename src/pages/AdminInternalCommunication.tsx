import { useEffect, useState, useRef } from "react";

interface User {
  id: number;
  name: string;
  role: string;
}

interface Message {
  id: number;
  sender: User;
  receiver: User;
  message: string;
  timestamp: string;
}

const AdminInternalCommunication = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [input, setInput] = useState("");
  
  // 🔹 Refs for the new Scroll Logic
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useRef(true);
  const userScrolled = useRef(false);

  const ADMIN_ID = 2; // Hardcoded for Admin

  // 🔹 Scroll Handler
  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 5;

    isAtBottom.current = atBottom;

    // 🔥 If user is NOT at bottom → mark as manually scrolled
    if (!atBottom) {
      userScrolled.current = true;
    }
  };

  // 🔹 Fetch ONLY Employees (non-admins)
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/admin/users");
        if (!res.ok) return;
        const data = await res.json();

        // Admin fetches everyone who is NOT an admin
        const filtered = data.filter((u: User) => u.role?.toLowerCase() !== "admin");
        setEmployees(filtered);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // 🔹 Fetch messages
  useEffect(() => {
    if (!selectedUser || !selectedUser.id) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/chat/conversation?user1=${ADMIN_ID}&user2=${selectedUser.id}`
        );
        if (!res.ok) return;
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  // 🛑 Reset the scroll lock whenever you click a different Employee
  useEffect(() => {
    userScrolled.current = false;
    isAtBottom.current = true;

    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [selectedUser]);

  // 🛑 Smart Auto-scroll
  useEffect(() => {
    if (!messagesEndRef.current) return;

    // 🔥 Only scroll if user hasn't scrolled OR is at bottom
    if (!userScrolled.current || isAtBottom.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    try {
      const res = await fetch("http://localhost:8080/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: ADMIN_ID,
          receiverId: selectedUser.id,
          message: input
        })
      });

      if (!res.ok) throw new Error("Failed to send");

      const newMessage = await res.json();
      setMessages(prev => [...prev, newMessage]);
      setInput("");
      
      // 🛑 Force a smooth scroll down ONLY when you manually send a message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-1 w-full h-full min-h-0 overflow-hidden bg-white text-gray-800 font-sans">
      
      {/* LEFT PANEL - Sidebar */}
      <div className="w-[30%] flex flex-col h-full border-r border-gray-200 bg-white shrink-0">
        <div className="h-16 bg-gray-50 flex items-center px-4 font-semibold text-lg border-b border-gray-200 shrink-0 text-gray-800">
          Employees
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {employees.length === 0 ? (
            <p className="text-gray-500 p-4 text-center mt-4">No employees found</p>
          ) : (
            employees.map(emp => (
              <div
                key={emp.id}
                onClick={() => setSelectedUser(emp)}
                className={`flex items-center px-4 py-3 cursor-pointer border-b border-gray-100 transition-colors ${
                  selectedUser?.id === emp.id ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <div className="w-12 h-12 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center mr-4 shrink-0 text-xl font-medium">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[17px] text-gray-900 font-medium truncate">{emp.name}</h2>
                  <p className="text-[14px] text-gray-500 truncate">Click to view chat</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Chat Area */}
      <div className="flex-1 flex flex-col h-full relative bg-white overflow-hidden min-h-0">
        
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundRepeat: 'repeat' }}
        ></div>

        {!selectedUser ? (
          <div className="flex items-center justify-center h-full z-10 text-gray-500 text-lg bg-gray-50">
            Select an Employee to start chatting
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-gray-50 flex items-center px-4 z-10 border-b border-gray-200 shrink-0">
              <div className="w-10 h-10 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center mr-3 text-lg font-medium">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="font-semibold text-[16px] text-gray-800">{selectedUser.name}</div>
            </div>

            {/* MESSAGES AREA */}
            <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 z-10 bg-white min-h-0">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center mt-10 bg-gray-100 border border-gray-200 px-4 py-1 rounded-full self-center text-xs">
                  Say hi to {selectedUser.name}
                </p>
              ) : (
                messages.map((msg, index) => {
                  const isSent = Number(msg.sender.id) === Number(ADMIN_ID);
                  const prevMsg = index > 0 ? messages[index - 1] : null;
                  const showTail = !prevMsg || prevMsg.sender.id !== msg.sender.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex w-full ${isSent ? "justify-end" : "justify-start"} ${showTail ? "mt-2" : "mt-0.5"}`}
                    >
                      <div
                        className={`
                          relative px-3 py-1.5 max-w-[65%] text-[15px] flex shadow-sm border min-w-[80px]
                          ${isSent
                            ? `bg-[#f9c5c6] border-[#ff2b2b] text-gray-900 rounded-lg ${showTail ? "rounded-tr-none" : ""}`
                            : `bg-gray-100 border-gray-200 text-gray-900 rounded-lg ${showTail ? "rounded-tl-none" : ""}`
                          }
                        `}
                      >
                        <span className="whitespace-pre-wrap leading-relaxed break-words break-all">
                          {msg.message}
                        </span>
                        
                        <span className="inline-block w-[70px] h-1"></span>

                        <span className="text-[11px] text-gray-500 absolute bottom-1.5 right-2 leading-none">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-gray-50 px-4 py-3 flex items-center z-10 shrink-0 border-t border-gray-200">
              <input
                className="flex-1 bg-white text-gray-900 px-4 py-3 rounded-lg outline-none placeholder-gray-500 text-[15px] border border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminInternalCommunication;