export default function List({
  items,
}: {
  items: { name: string; rating: string; fare: number }[];
}) {
  return (
    <ul>
      {items.map((item) => (
        <li className="w-full flex justify-center m-2">
          <div className="border rounded-2xl text-xl w-80 p-2">
            <h1>Driver: {item.name}</h1>
            <p>Rating: {item.rating}</p>
            <div>
              <p>Fare: ${item.fare}</p>
              <button></button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
