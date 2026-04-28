const WhyRentBeta = () => {
  return (
    <div className="py-16 px-4">

      {/* TITLE */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
        Why RentBeta?
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

        {/* CARD 1 */}
        <div className="bg-purple-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition">
          <div className="flex justify-center mb-4">
            <img
              src="/icons/map.png"
              alt="Map & Location"
              className="w-14 h-14"
            />
          </div>

          <h3 className="font-semibold text-lg text-gray-900">
            Map & Location
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            We seal actinate modernon about intentters of your instinls.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="bg-purple-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition">
          <div className="flex justify-center mb-4">
            <img
              src="/icons/handshake.png"
              alt="Handset Dagmént"
              className="w-14 h-14"
            />
          </div>

          <h3 className="font-semibold text-lg text-gray-900">
            Handset Dagmént
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Prestos the customer address and wesler components.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="bg-purple-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition">
          <div className="flex justify-center mb-4">
            <img
              src="/icons/clock.png"
              alt="Clock Coverting"
              className="w-14 h-14"
            />
          </div>

          <h3 className="font-semibold text-lg text-gray-900">
            Clock Coverting
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Clock rompsare.adhesur/sem sem anothor comescion.
          </p>
        </div>

      </div>
    </div>
  );
};

export default WhyRentBeta;