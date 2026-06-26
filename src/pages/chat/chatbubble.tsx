import { Check, CheckCheck } from "lucide-react";

type Props = {
  mine: boolean;
  message: string;
  createdAt: string;
  read?: boolean;
};

export default function ChatBubble({
  mine,
  message,
  createdAt,
  read,
}: Props) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 shadow ${
          mine
            ? "bg-purple-600 text-white rounded-br-md"
            : "bg-white rounded-bl-md"
        }`}
      >
        <p className="break-words">{message}</p>

        <div className="flex justify-end items-center gap-1 mt-1">
          <span className="text-[10px] opacity-70">
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {mine &&
            (read ? (
              <CheckCheck size={13} />
            ) : (
              <Check size={13} />
            ))}
        </div>
      </div>
    </div>
  );
}