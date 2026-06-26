import { useCallback, useEffect, useRef, useState } from "react";import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../superbase";
import { ArrowLeft, Send } from "lucide-react";
import ChatSkeleton from "./chatskeleton";
import { MapPin, ArrowUpRight } from "lucide-react";


type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  read: boolean;
};

type Conversation = {
  id: string;
  landlord_id: string;
  tenant_id: string;
  property_id: string;

  properties: {
    id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
  };
};

type User = {
  id: string;
  full_name: string;
};

export default function ChatRoom() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);



useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "smooth",
    
  });
}, [messages]);

 const loadChat = useCallback(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  setCurrentUser(user);

 const { data: convo } = await supabase
  .from("conversations")
  .select(`
    *,
    properties (
      id,
      title,
      location,
      price,
      images
    )
  `)
  .eq("id", conversationId)
  .single();
  if (!convo) return;

  setConversation(convo);

  const otherUserId =
    convo.landlord_id === user.id
      ? convo.tenant_id
      : convo.landlord_id;

  const { data: otherUser } = await supabase
    .from("users")
    .select("id, full_name")
    .eq("id", otherUserId)
    .single();

  setReceiver(otherUser);

  const { data: msgs } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  setMessages(msgs || []);

  // Mark messages from the other user as read
// Mark all messages from the other user as read
await supabase
  .from("messages")
  .update({ read: true })
  .eq("conversation_id", conversationId)
  .neq("sender_id", user.id);

// Refresh the unread badge immediately
window.dispatchEvent(new Event("messages-read"));

setLoading(false);
}, [conversationId]);


useEffect(() => {
  loadChat();
}, [loadChat]);


const sendMessage = async () => {
  if (!text.trim() || !currentUser) return;

  const messageText = text;

  // clear input immediately
  setText("");

  // temporary message (shows instantly)
  const tempMessage: Message = {
    id: crypto.randomUUID(),
    conversation_id: conversationId!,
    sender_id: currentUser.id,
    message: messageText,
    created_at: new Date().toISOString(),
    read: false,
  };

  // show instantly
  setMessages((prev) => [...prev, tempMessage]);

  bottomRef.current?.scrollIntoView({
    behavior: "smooth",
  });

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: currentUser.id,
      message: messageText,
    })
    .select()
    .single();

  if (error) {
    console.log(error);

    // remove optimistic message if insert failed
    setMessages((prev) =>
      prev.filter((m) => m.id !== tempMessage.id)
    );

    return;
  }

  // replace temporary message with real one
  setMessages((prev) =>
    prev.map((m) =>
      m.id === tempMessage.id ? data : m
    )
  );

  await supabase
    .from("conversations")
    .update({
      last_message: messageText,
      last_message_at: new Date().toISOString(),
    })
    .eq("id", conversationId);
};


useEffect(() => {
  if (!conversationId) return;

  const channel = supabase
    .channel(`chat-${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
    async (payload) => {
  const newMessage = payload.new as Message;

  setMessages((old) => {
    if (old.some((m) => m.id === newMessage.id)) return old;

    return [...old, newMessage];
  });

  // If the message came from the other user,
  // immediately mark it as read.
  if (newMessage.sender_id !== currentUser?.id) {
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("id", newMessage.id);
  }
}


    )
    .subscribe((status) => {
      console.log("Realtime Status:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, [conversationId]);



 if (loading) return <ChatSkeleton />;

  return (
    <div className="h-screen flex flex-col bg-white">

      {/* HEADER */}

      <div className="bg-purple-600 text-white px-4 py-3 flex items-center gap-3 shadow">

        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>

        <div>
          <h2 className="font-semibold">
            {receiver?.full_name}
          </h2>

          <p className="text-xs opacity-80">
            Conversation
          </p>
        </div>

      </div>

      {/* PROPERTY CARD */}
{/* PROPERTY PREVIEW */}
{conversation?.properties && (
  <div className=" z-20 bg-white border-b">
    <div className="flex items-center justify-between px-4 py-3">

      <div className="flex items-center gap-3">

        <img
          src={conversation.properties.images?.[0]}
          alt={conversation.properties.title}
          className="w-16 h-16 rounded-xl object-cover"
        />

        <div>

          <h2 className="font-semibold text-gray-900 text-sm">
            {conversation.properties.title}
          </h2>

         <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
  <MapPin size={14} />
  {conversation.properties.location}
</p>

          <p className="mt-1 font-semibold text-purple-600">
            ₦{conversation.properties.price.toLocaleString()}
          </p>

        </div>

      </div>

     <button
  onClick={() =>
    navigate(`/property/${conversation.properties.id}`)
  }
  className="flex items-center gap-1 rounded-xl border border-purple-600 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-600 hover:text-white transition"
>
  View
  <ArrowUpRight size={15} />
</button>

    </div>
  </div>
)}

      {/* MESSAGES */}

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">

        {messages.map((msg) => {

          const mine = msg.sender_id === currentUser.id;

          return (

            <div
              key={msg.id}
              className={`flex ${
                mine ? "justify-end" : "justify-start"
              }`}
            >

              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 shadow

                ${
                  mine
                    ? "bg-gray-300 text-gray-700"
                    : "bg-white text-gray-800"
                }
                `}
              >

                <p>{msg.message}</p>

             <div className="flex justify-end items-center gap-1 mt-1 text-[10px] opacity-70">
  <span>
    {new Date(msg.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </span>

  {msg.sender_id === currentUser.id && (
    <span>
      {msg.read ? "read" : "delivered"}
    </span>
  )}
</div>

              </div>

            </div>

          );

        })}

        <div ref={bottomRef} />

      </div>

      {/* INPUT */}

  {/* INPUT */}
<div className="sticky bottom-0 left-0 bg-white border-t p-3 flex gap-2 shadow-lg z-10">

  <input
    value={text}
    onChange={(e) => setText(e.target.value)}
    placeholder="Type a message..."
    className="flex-1 border rounded-full px-4 py-3 outline-none"
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    }}
  />

  <button
    onClick={sendMessage}
    className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition"
  >
    <Send size={20} />
  </button>

</div>

    </div>
  );
}