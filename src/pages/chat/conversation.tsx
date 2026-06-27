import { useEffect, useState } from "react";
import { supabase } from "../../superbase";
import ConversationCard from "./conveersationCard";
import ConversationSkeleton from "./conversationSkeketon";

export default function Conversations() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Fetch conversations with property information
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          properties(
            id,
            title,
            images
          )
        `)
        .or(`tenant_id.eq.${user.id},landlord_id.eq.${user.id}`)
        .order("last_message_at", {
          ascending: false,
        });

      if (error || !data) {
        console.log(error);
        setConversations([]);
        setLoading(false);
        return;
      }

      const chats = [];

      for (const convo of data) {
        const otherUserId =
          convo.landlord_id === user.id
            ? convo.tenant_id
            : convo.landlord_id;

        // Fetch other user's profile
        const { data: profile } = await supabase
          .from("users")
          .select("full_name , avatar_url")
          .eq("id", otherUserId)
          .maybeSingle();

        // Count unread messages
        const { count } = await supabase
          .from("messages")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("conversation_id", convo.id)
          .eq("read", false)
          .neq("sender_id", user.id);

        chats.push({
          ...convo,
          full_name: profile?.full_name || "Unknown User",
           avatar_url: profile?.avatar_url || "",
          property_name: convo.properties?.title || "",
          property_image: convo.properties?.images?.[0] || "",
          unread: count || 0,
        });
      }

      setConversations(chats);
    } catch (err) {
      console.error(err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ConversationSkeleton />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-purple-600 text-white p-5 shadow z-10">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      {/* Empty State */}
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[75vh] text-center">
          <div className="text-6xl mb-4">💬</div>

          <h2 className="text-xl font-semibold text-gray-700">
            No Messages Yet
          </h2>

          <p className="text-gray-500 mt-2 max-w-sm">
            You haven't started any conversations yet.
            Once you message a landlord or tenant,
            your chats will appear here.
          </p>
        </div>
      ) : (
        <div className="pb-20">
          {conversations.map((chat) => (
            <ConversationCard
              key={chat.id}
              id={chat.id}
              name={chat.full_name}
              avatar={chat.avatar_url}
              propertyName={chat.property_name}
            //   propertyImage={chat.property_image}
              lastMessage={chat.last_message || "Start chatting..."}
              lastTime={chat.last_message_at}
              unread={chat.unread}
            />
          ))}
        </div>
      )}
    </div>
  );
}