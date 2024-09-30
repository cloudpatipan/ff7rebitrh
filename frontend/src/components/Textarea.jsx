export function Textarea({ type, name, value, placeholder, onChange }) {
    return (
        <textarea type={type}
            value={value}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            className={`block w-full text-base border-b border-[#176db0] appearance-none bg-transparent border px-2 py-1 placeholder:text-sm focus:outline-none`}
        />
    )
}