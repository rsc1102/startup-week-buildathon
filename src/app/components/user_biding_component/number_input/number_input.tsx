export default function NumberInput({onChange, value}:{onChange: (value: number) => void,value:number}) {

  return (
    <input
      type="number"
      className="border rounded-lg p-2 outline-none w-25 text-center"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}

    ></input>
  );
}
