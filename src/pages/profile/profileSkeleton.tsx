export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 ">
      {/* Header */}
      <div className="bg-purple-200 h-48 rounded-b-3xl"></div>

      <div className="-mt-16 px-5">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white mx-auto"></div>

        {/* Name */}
        <div className="mt-5 flex flex-col items-center">
          <div className="h-6 w-44 bg-gray-300 rounded"></div>

          <div className="h-4 w-60 bg-gray-200 rounded mt-3"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl p-5 shadow"
            >
              <div className="h-7 w-10 bg-gray-300 rounded mx-auto"></div>

              <div className="h-3 w-16 bg-gray-200 rounded mx-auto mt-3"></div>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl shadow mt-6 p-5 space-y-5">
          {[1, 2, 3, 4].map((item) => (
            <div key={item}>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>

              <div className="h-5 w-52 bg-gray-300 rounded mt-2"></div>
            </div>
          ))}
        </div>

        {/* Apartments */}
        <div className="mt-8 space-y-5">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl shadow overflow-hidden"
            >
              <div className="h-48 bg-gray-300"></div>

              <div className="p-4">
                <div className="h-5 w-44 bg-gray-300 rounded"></div>

                <div className="h-4 w-32 bg-gray-200 rounded mt-3"></div>

                <div className="h-5 w-24 bg-gray-300 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="space-y-4 mt-8 pb-10">
          <div className="h-12 bg-gray-300 rounded-xl"></div>

          <div className="h-12 bg-gray-300 rounded-xl"></div>

          <div className="h-12 bg-gray-300 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}