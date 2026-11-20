const SearchBar = ({
    value,
    onChange,
    placeholder = 'Search...',
    className = '',
}) => {
    return (
        <div className={`relative w-full ${className}`}>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500">
                ⌕
            </span>

            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
            />
        </div>
    );
};

export default SearchBar;