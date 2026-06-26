import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../superbase";

export default function ChatFAB() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUser(user);

    loadUnread(user.id);

    subscribe(user.id);
  }

  async function loadUnread(userId: string) {
    const { data: conversations } = await supabase
      .from("conversations")
      .select("id")
      .or(`tenant_id.eq.${userId},landlord_id.eq.${userId}`);

    if (!conversations || conversations.length === 0) {
      setUnread(0);
      return;
    }

    const ids = conversations.map((c) => c.id);

    const { count } = await supabase
      .from("messages")
      .select("*", {
        count: "exact",
        head: true,
      })
      .in("conversation_id", ids)
      .eq("read", false)
      .neq("sender_id", userId);

    setUnread(count || 0);
  }

  function subscribe(userId: string) {
    const channel = supabase
      .channel("chat-fab")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          loadUnread(userId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  if (!user) return null;

  return (
    <button
      onClick={() => navigate("/chat")}
      className="fixed bottom-24 right-5 z-50"
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-purple-600 shadow-xl flex items-center justify-center text-white hover:scale-105 transition">
          <MessageCircle size={20} />
        </div>

        {unread > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs min-w-[22px] h-[22px] rounded-full flex items-center justify-center font-bold px-1">
            {unread > 99 ? "99+" : unread}
          </div>
        )}
      </div>
    </button>
  );
}