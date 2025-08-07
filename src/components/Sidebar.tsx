import React from "react";
import { MdHome, MdTask } from "react-icons/md";
import GetUserTimeLocation from "./UI/GetUserTimeLocation";
import { Link, useNavigate } from "react-router-dom"
type SidebarProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
    const navigate = useNavigate();

    return (
        <>
            {/* Burger Button di luar sidebar (hanya saat sidebar tertutup) */}
            {!open && (
                <button
                    className="fixed top-4 left-4 z-50 bg-white border rounded p-2 shadow"
                    onClick={() => setOpen(true)}
                    aria-label="Open Sidebar"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor">
                        <rect y="5" width="24" height="2" rx="1" fill="currentColor" />
                        <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
                        <rect y="17" width="24" height="2" rx="1" fill="currentColor" />
                    </svg>
                </button>
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-screen w-64 bg-white border-r flex flex-col justify-between transition-transform duration-300 z-40
                ${open ? "translate-x-0" : "-translate-x-full"}`}>
                {/* Header Sidebar: Logo & Burger Btn */}
                <div className="flex items-center justify-between gap-2 p-4 border-b bg-blue-600 text-white">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg ">My Todos</span>
                    </div>
                    {/* Burger Button di dalam sidebar (hanya saat sidebar terbuka) */}
                    {open && (
                        <button
                            className=" border rounded p-2 shadow"
                            onClick={() => setOpen(false)}
                            aria-label="Close Sidebar"
                        >
                            <svg width="24" height="24" fill="none" stroke="currentColor">
                                <rect y="5" width="24" height="2" rx="1" fill="currentColor" />
                                <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
                                <rect y="17" width="24" height="2" rx="1" fill="currentColor" />
                            </svg>
                        </button>
                    )}
                </div>
                {/* Menu Utama */}
                <nav className="mt-4">
                    <ul className="space-y-2">
                        <Link to="/">
                            <li className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer transition">
                                <MdHome size={20} className="text-gray-500" />
                                <span className="hidden md:inline">Home</span>
                            </li>
                        </Link>
                        <li
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer transition"
                            onClick={() => {
                                const lastId = localStorage.getItem("last-board-id");
                                if (lastId) {
                                    navigate(`/todo/${lastId}`);
                                } else {
                                    navigate("/");
                                }
                            }}
                        >
                            <MdTask size={20} className="text-gray-500" />
                            <span className="hidden md:inline">My Tasks</span>
                        </li>
                    </ul>
                </nav>
                {/* Section Workspace */}
                <div className="mt-8 px-4">
                    <h2 className="text-xs text-gray-400 uppercase mb-2">Workspace</h2>
                    <ul className="space-y-1">
                        <li className="text-sm text-gray-700 hover:bg-gray-100 rounded px-2 py-1 cursor-pointer transition">My Workspace 1</li>
                        <li className="text-sm text-gray-700 hover:bg-gray-100 rounded px-2 py-1 cursor-pointer transition">My personal Project</li>
                        <li className="text-sm text-gray-700 hover:bg-gray-100 rounded px-2 py-1 cursor-pointer transition">My Workspace 2</li>
                    </ul>
                </div>
                {/* Info User di bawah */}
                <div className="p-4 mt-auto border-t bg-blue-300 text-white">
                    <GetUserTimeLocation />
                </div>
            </div>
        </>
    );
};

export default Sidebar;