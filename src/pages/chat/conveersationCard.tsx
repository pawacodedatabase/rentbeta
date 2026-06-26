import { useNavigate } from "react-router-dom";

type Props = {
  id: string;
  name?: string;
  propertyName?: string;
  lastMessage?: string;
  lastTime?: string;
  unread?: number;
};

export default function ConversationCard({
  id,
  name,
  propertyName,
  lastMessage,
  lastTime,
  unread = 0,
}: Props) {
  const navigate = useNavigate();

  const displayName = name || "Unknown User";

  return (
    <button
      onClick={() => navigate(`/chat/${id}`)}
      className="w-full bg-white flex items-center gap-4 p-4 border-b hover:bg-gray-50 transition"
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
        {displayName.charAt(0).toUpperCase()}
      </div>

      {/* Name + Message */}
     {/* Name + Property */}
<div className="flex-1 text-left overflow-hidden">
  <div className="flex items-center gap-2">
    <h2 className="font-semibold truncate">
      {displayName}
    </h2>

    {propertyName && (
      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full truncate max-w-[130px]">
        {propertyName}
      </span>
    )}
  </div>

  <p className="text-gray-500 text-sm truncate mt-1">
    {lastMessage || "No messages yet"}
  </p>
</div>
      {/* Time + Unread */}
      <div className="flex flex-col items-end">
        <span className="text-xs text-gray-400">
          {lastTime
            ? new Date(lastTime).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })
            : ""}
        </span>

        {unread > 0 && (
          <div className="mt-2 min-w-5 h-5 px-1 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">
            {unread}
          </div>
        )}
      </div>
    </button>
  );
}