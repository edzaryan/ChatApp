type Props = {
    name: string;
    imageUrl?: string;
}

function getInitials(name?: string) {
    if (!name) return "?";

    return name
        .trim()
        .split(" ")
        .map(p => p[0])
        .join("")
        .toUpperCase();
}

function Avatar({ name, imageUrl }: Props) {
    if (imageUrl) {
        return (
            <img src={imageUrl} className="w-10 h-10 rounded-full object-cover" />
        );
    }

    return (
        <div 
            className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
            {getInitials(name)}
        </div>
    )
}

export default Avatar;