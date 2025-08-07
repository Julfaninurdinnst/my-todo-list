import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Board } from "../lib/types";
import { MdEdit, MdDelete } from "react-icons/md";

// Toast sederhana
function showToast(message: string, color = "bg-green-600") {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className =
        `${color} text-white px-4 py-2 rounded shadow fixed top-6 right-6 z-[9999] animate-fade-in`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("animate-fade-out");
        setTimeout(() => toast.remove(), 400);
    }, 1800);
}
const Home = () => {
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const [boardTitle, setBoardTitle] = useState("");
    const [error, setError] = useState("");
    const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
    const [renameTitle, setRenameTitle] = useState("");

    const boards: Board[] = JSON.parse(localStorage.getItem("my-todo-boards") || "[]");

    const handleCreateBoard = () => {
        if (!boardTitle.trim()) {
            setError("Board title is required");
            return;
        }
        const newBoard: Board = {
            id: "board-" + Date.now(),
            title: boardTitle,
            lists: [
                { id: 1, title: "Todo List", cards: [] },
                { id: 2, title: "Doing", cards: [] },
                { id: 3, title: "Finish", cards: [] },
            ],
        };
        const updatedBoards = [...boards, newBoard];
        localStorage.setItem("my-todo-boards", JSON.stringify(updatedBoards));
        setShowDialog(false);
        setBoardTitle("");
        setError("");
        showToast("Board created!");
        setTimeout(() => navigate(`/todo/${newBoard.id}`), 600);
    };

    // Rename board
    const handleRenameBoard = (boardId: string) => {
        const updatedBoards = boards.map(board =>
            board.id === boardId ? { ...board, title: renameTitle } : board
        );
        localStorage.setItem("my-todo-boards", JSON.stringify(updatedBoards));
        setEditingBoardId(null);
        setRenameTitle("");
        showToast("Board renamed!");
        setTimeout(() => window.location.reload(), 600);
    };

    // Delete board
    const handleDeleteBoard = (boardId: string) => {
        // Ganti confirm dengan toast info
        const updatedBoards = boards.filter(board => board.id !== boardId);
        localStorage.setItem("my-todo-boards", JSON.stringify(updatedBoards));
        showToast("Board deleted!", "bg-red-600");
        setTimeout(() => window.location.reload(), 600);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center pt-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-gray-400 rounded-lg w-16 h-16 flex items-center justify-center text-3xl font-bold text-white">
                    M
                </div>
                <div>
                    <div className="text-2xl font-semibold">My Workspace</div>
                    <div className="text-sm text-gray-500">Private</div>
                </div>
            </div>
            <hr className="w-full max-w-3xl mb-8" />
            <div className="w-full max-w-3xl">
                <div className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="material-icons text-gray-500">person</span>
                    Your boards
                </div>
                <div className="flex gap-6 flex-wrap relative">
                    {boards.map(board => (
                        <div
                            key={board.id}
                            className="bg-blue-400 rounded-lg w-64 h-32 flex flex-col justify-end items-start p-4 shadow hover:bg-blue-500 transition relative group"
                        >
                            {editingBoardId === board.id ? (
                                <div className="w-full">
                                    <input
                                        className="border rounded px-2 py-1 w-full text-sm"
                                        value={renameTitle}
                                        onChange={e => setRenameTitle(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                            onClick={() => handleRenameBoard(board.id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                                            onClick={() => {
                                                setEditingBoardId(null);
                                                setRenameTitle("");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span
                                        className="text-white font-semibold text-lg mb-2 cursor-pointer"
                                        onClick={() => navigate(`/todo/${board.id}`)}
                                    >
                                        {board.title}
                                    </span>
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-80 group-hover:opacity-100">
                                        <button
                                            className="text-white hover:text-yellow-300"
                                            title="Rename"
                                            onClick={() => {
                                                setEditingBoardId(board.id);
                                                setRenameTitle(board.title);
                                            }}
                                        >
                                            <MdEdit size={18} />
                                        </button>
                                        <button
                                            className="text-white hover:text-red-400"
                                            title="Delete"
                                            onClick={() => handleDeleteBoard(board.id)}
                                        >
                                            <MdDelete size={18} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    <div className="relative">
                        <button
                            className="bg-gray-100 rounded-lg w-64 h-32 flex flex-col justify-center items-center shadow hover:bg-gray-200 transition"
                            onClick={() => setShowDialog(true)}
                        >
                            <span className="text-gray-500 font-semibold text-lg">Create new board</span>
                        </button>
                        {/* Dialog Create Board, absolute di samping kanan tombol */}
                        {showDialog && (
                            <div className="absolute left-full top-0 ml-4 bg-white rounded-lg shadow-lg border w-80 p-6 flex flex-col z-50">
                                <button
                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                        setShowDialog(false);
                                        setBoardTitle("");
                                        setError("");
                                    }}
                                >
                                    ×
                                </button>
                                <div className="text-lg font-semibold mb-4">Create board</div>
                                <div className="mb-2">
                                    <label className="block text-xs font-semibold mb-1">Board title <span className="text-red-500">*</span></label>
                                    <input
                                        className="border rounded px-3 py-2 w-full"
                                        value={boardTitle}
                                        onChange={e => {
                                            setBoardTitle(e.target.value);
                                            setError("");
                                        }}
                                        autoFocus
                                    />
                                    {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs font-semibold mb-1">Visibility</label>
                                    <select className="border rounded px-3 py-2 w-full" disabled>
                                        <option>Workspace</option>
                                    </select>
                                </div>
                                <button
                                    className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
                                    onClick={handleCreateBoard}
                                >
                                    Create
                                </button>
                                <button
                                    className="mt-2 text-xs text-gray-500 hover:underline"
                                    onClick={() => {
                                        setShowDialog(false);
                                        setBoardTitle("");
                                        setError("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;