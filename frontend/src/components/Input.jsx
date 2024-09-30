export function Input({ type, name, id, value, className , placeholder, onChange }) {
    return (
        <input type={type}
            value={value}
            name={name}
            id={id}
            onChange={onChange}
            placeholder={placeholder}
            className={`${className} block w-full text-base border-b border-[#176db0] appearance-none bg-transparent border px-2 py-1 placeholder:text-sm focus:outline-none`}
        />
    )
}