export default function ConversationSkeleton() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 animate-pulse border-b"
        >
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>

          <div className="flex-1">
            <div className="w-40 h-4 rounded bg-gray-300 mb-2"></div>
            <div className="w-60 h-3 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </>
  );
}