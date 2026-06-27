import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../superbase";

export default function ChatFAB() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await loadUnread(session.user.id);
        cleanup = subscribe(session.user.id);
      } else {
        setUser(null);
        setUnread(0);
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cleanup) {
        cleanup();
        cleanup = undefined;
      }

      if (session?.user) {
        setUser(session.user);
        await loadUnread(session.user.id);
        cleanup = subscribe(session.user.id);
      } else {
        setUser(null);
        setUnread(0);
      }
    });

    return () => {
      subscription.unsubscribe();

      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  async function loadUnread(userId: string) {
    const { data: conversations } = await supabase
      .from("conversations")
      .select("id")
      .or(`tenant_id.eq.${userId},landlord_id.eq.${userId}`);

    if (!conversations?.length) {
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

    setUnread(count ?? 0);
  }

  function subscribe(userId: string) {
    const channel = supabase
      .channel(`chatfab-${userId}`)

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => loadUnread(userId)
      )

      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        () => loadUnread(userId)
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  const handleClick = () => {
    if (user) {
      navigate("/chat");
    } else {
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 left-5 z-50"
    >
      <div className="relative">

        <div className="w-12 h-12 rounded-full bg-black hover:bg-purple-600 shadow-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110">
          <MessageCircle size={22} />
        </div>

        {user && unread > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1">
            {unread > 99 ? "99+" : unread}
          </div>
        )}

      </div>
    </button>
  );
}