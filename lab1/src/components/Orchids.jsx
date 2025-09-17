import ListOfOrchids from "../shared/ListOfOrchids";
import OrchidItem from "./OrchidItem";

export default function Orchids() {
  return (
    <div className="mx-auto max-w-7xl px-4 text-center">
      <h1 className="text-3xl">Orchid List</h1>
      <div className="grid mt-3 gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {ListOfOrchids.map((item) => (
          <OrchidItem orchid={item} />
        ))}
      </div>
    </div>
  );
}
