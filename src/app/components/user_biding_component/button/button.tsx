
export default function Button({onClick, svg}:{onClick:()=>void,svg:React.ReactNode}){
    return (
        <button onClick={onClick} className="m-2 border rounded-xl p-2">{svg}</button>
    )
}