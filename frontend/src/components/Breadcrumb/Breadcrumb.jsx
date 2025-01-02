import Link from 'next/link';

export default function Breadcrumb({ paths }) {
    return (
        <nav className="flex items-center text-sm text-gray-600 space-x-2">
            {paths.map((path, index) => (
                <div key={index} className="flex items-center">
                    {index < paths.length - 1 ? (
                        <Link
                            href={path.href}
                            className="hover:text-foreground hover:underline"
                        >
                            {path.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-semibold">{path.label}</span>
                    )}
                    {}
                    {index < paths.length - 1 && (
                        <span className="mx-2 text-gray-400">/</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
