function Star({ filled }) {
  return (
    <span
      className={
        filled ? "text-yellow-400 opacity-100" : "text-gray-400 opacity-30"
      }
    >
      ★
    </span>
  );
}

export default function OrchidItem({
  orchid: { id, name, image, rating, isSpecial, color, origin, category },
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-transform hover:-translate-y-1 hover:scale-105">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={image}
          alt={name}
          className="block h-44 w-full object-cover"
        />
        {isSpecial && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-1 text-xs font-semibold text-white">
            Special
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h3 className="m-0 text-base font-bold">{name}</h3>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((start) => (
            <Star key={start} filled={start <= rating} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
        <span className="text-gray-500">ID</span>
        <span>{id}</span>
        <span className="text-gray-500">Origin</span>
        <span>{origin}</span>
        <span className="text-gray-500">Color</span>
        <span>{color}</span>

        <span className="text-gray-500">Category</span>
        <span>{category}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-gray-200 bg-gray-300 px-2 py-1 text-xs">
          #{category}
        </span>
        <span className="rounded-full border border-gray-200 bg-gray-300 px-2 py-1 text-xs">
          {color}
        </span>
      </div>
    </div>
  );
}
