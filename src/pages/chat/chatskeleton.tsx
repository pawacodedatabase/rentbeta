export default function ChatSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-[#efeae2] ">

      {/* Header */}
      <div className="bg-purple-600 h-16"></div>

      {/* Messages */}
      <div className="flex-1 p-5 space-y-4">

        <div className="flex justify-start">
          <div className="bg-white rounded-2xl h-12 w-44"></div>
        </div>

        <div className="flex justify-end">
          <div className="bg-purple-300 rounded-2xl h-12 w-56"></div>
        </div>

        <div className="flex justify-start">
          <div className="bg-white rounded-2xl h-12 w-36"></div>
        </div>

        <div className="flex justify-end">
          <div className="bg-purple-300 rounded-2xl h-12 w-60"></div>
        </div>

      </div>

      {/* Input */}
      <div className="border-t bg-white p-3">
        <div className="h-12 bg-gray-200 rounded-full"></div>
      </div>

    </div>
  );
}