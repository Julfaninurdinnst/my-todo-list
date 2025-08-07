import React, { useState, useRef, useEffect } from "react";
import { MdNotifications, MdPerson, MdHistory, MdCreditCard, MdSettings, MdHelp, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const [showCreateDropdown, setShowCreateDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    // Close dropdown if click outside
    const createRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                createRef.current && !createRef.current.contains(e.target as Node)
            ) setShowCreateDropdown(false);
            if (
                profileRef.current && !profileRef.current.contains(e.target as Node)
            ) setShowProfileDropdown(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <>
            <header className="flex items-center justify-between h-19 px-6 bg-white border-b shadow-sm w-full relative">
                {/* Search Bar */}
                <div className="flex items-center w-full max-w-xl mx-auto">
                    <div className="relative w-full">
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <input
                                type="text"
                                className="border rounded px-2 py-1"
                                placeholder="Search cards..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="p-2">
                                <MdSearch size={20} />
                            </button>
                        </form>
                    </div>
                </div>
                {/* Kanan: Tombol dan avatar */}
                <div className="flex items-center gap-4">
                    {/* Create Button & Dropdown */}
                    <div className="relative" ref={createRef}>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            onClick={() => setShowCreateDropdown((v) => !v)}
                        >
                            Create
                        </button>
                        {showCreateDropdown && (
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border z-50">
                                <button className="flex items-start gap-2 w-full px-4 py-3 hover:bg-gray-100 text-left">
                                    <span className="mt-1">
                                        <MdNotifications size={20} className="text-gray-500" />
                                    </span>
                                    <span>
                                        <span className="font-semibold">Create Workspace</span>
                                        <div className="text-xs text-gray-500">
                                            A workspace is a collection of boards. Use it to manage projects, track information, or organize anything.
                                        </div>
                                    </span>
                                </button>

                            </div>
                        )}
                    </div>
                    {/* Avatar & Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <div
                            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-base cursor-pointer border"
                            onClick={() => setShowProfileDropdown((v) => !v)}
                        >
                            JN
                        </div>
                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                                <div className="p-4">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">JN</div>
                                        <div>
                                            <div className="font-semibold">julfani nurdin</div>
                                            <div className="text-xs text-gray-500">julfanninst123@gmail.com</div>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                                        <MdPerson className="text-gray-500" size={18} />
                                        My profile
                                    </button>
                                    <button className="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                                        <MdHistory className="text-gray-500" size={18} />
                                        Activity
                                    </button>
                                    <button className="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                                        <MdCreditCard className="text-gray-500" size={18} />
                                        Cards
                                    </button>
                                    <button className="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                                        <MdSettings className="text-gray-500" size={18} />
                                        Settings
                                    </button>
                                    <button className="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                                        <MdHelp className="text-gray-500" size={18} />
                                        Help
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;