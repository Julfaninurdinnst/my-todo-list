import React, { useState, useEffect } from "react";
import { MdShare, MdFileDownload, MdDelete, MdEdit, MdMoreVert } from "react-icons/md";
import {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult
} from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import type { Board, List } from "../lib/types";

const TodoBoard: React.FC = () => {
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            localStorage.setItem("last-board-id", id);
        }
    }, [id]);
    const [boards] = useState<Board[]>(() =>
        JSON.parse(localStorage.getItem("my-todo-boards") || "[]")
    );
    const boardIndex = boards.findIndex(b => b.id === id);
    const board = boardIndex !== -1 ? boards[boardIndex] : undefined;

    // State untuk lists, dsb
    const [lists, setLists] = useState<List[]>(board?.lists || []);
    const [newCardText, setNewCardText] = useState<{ [key: number]: string }>({});
    const [newListTitle, setNewListTitle] = useState<string>("");
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [activeListMenu, setActiveListMenu] = useState<number | null>(null);
    const [renameTitle, setRenameTitle] = useState<string>("");
    const [editingListId, setEditingListId] = useState<number | null>(null);

    // Sync lists ke localStorage setiap kali lists berubah
    useEffect(() => {
        if (boardIndex === -1) return;
        const boardsFromStorage: Board[] = JSON.parse(localStorage.getItem("my-todo-boards") || "[]");
        const updatedBoards = [...boardsFromStorage];
        updatedBoards[boardIndex] = { ...updatedBoards[boardIndex], lists };
        localStorage.setItem("my-todo-boards", JSON.stringify(updatedBoards));
    }, [lists, boardIndex]);

    // Setelah semua hook, baru cek board
    if (!board) return <div className="p-8">Board not found</div>;

    // Handler tambah card
    const handleAddCard = (listId: number) => {
        if (!newCardText[listId]) return;
        setLists(lists =>
            lists.map(list =>
                list.id === listId
                    ? {
                        ...list,
                        cards: [
                            ...list.cards,
                            { id: Date.now().toString(), title: newCardText[listId] }
                        ]
                    }
                    : list
            )
        );
        setNewCardText({ ...newCardText, [listId]: "" });
    };

    // Handler tambah list
    const handleAddList = () => {
        if (!newListTitle.trim()) return;
        setLists([
            ...lists,
            { id: Date.now(), title: newListTitle, cards: [] }
        ]);
        setNewListTitle("");
    };

    // Handler hapus card
    const handleDeleteCard = (listId: number, cardId: string) => {
        setLists(lists =>
            lists.map(list =>
                list.id === listId
                    ? { ...list, cards: list.cards.filter(card => card.id !== cardId) }
                    : list
            )
        );
    };

    // Handler hapus list
    const handleDeleteList = (listId: number) => {
        setLists(lists => lists.filter(list => list.id !== listId));
        setActiveListMenu(null);
    };

    // Handler rename list
    const handleRenameList = (listId: number) => {
        setLists(lists =>
            lists.map(list =>
                list.id === listId ? { ...list, title: renameTitle } : list
            )
        );
        setActiveListMenu(null);
        setRenameTitle("");
        setEditingListId(null);
    };

    // Handler drag & drop
    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        const sourceListIdx = lists.findIndex(l => l.id === Number(source.droppableId));
        const destListIdx = lists.findIndex(l => l.id === Number(destination.droppableId));
        if (sourceListIdx === -1 || destListIdx === -1) return;

        const sourceCards = Array.from(lists[sourceListIdx].cards);
        const [removed] = sourceCards.splice(source.index, 1);

        const destCards = Array.from(lists[destListIdx].cards);
        destCards.splice(destination.index, 0, removed);

        setLists(lists =>
            lists.map((list, idx) =>
                idx === sourceListIdx
                    ? { ...list, cards: sourceCards }
                    : idx === destListIdx
                        ? { ...list, cards: destCards }
                        : list
            )
        );
    };

    // Export ke CSV
    const handleExport = () => {
        let csv = "List,Card\n";
        lists.forEach(list => {
            list.cards.forEach(card => {
                csv += `"${list.title}","${card.title}"\n`;
            });
        });
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "todo-list.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const isMobile = typeof window !== "undefined" && window.innerWidth < 900;
    const shareLink = window.location.href;

    return (
        <div className="flex flex-col min-h-screen h-full bg-blue-300 p-6">
            {/* Header Board */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {board.title}
                </h1>
                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-1 px-3 py-1 bg-white rounded shadow text-blue-600 hover:bg-blue-100 font-semibold"
                        onClick={handleExport}
                    >
                        <MdFileDownload size={20} />
                        Export
                    </button>
                    <button
                        className="flex items-center gap-1 px-3 py-1 bg-white rounded shadow text-blue-600 hover:bg-blue-100 font-semibold"
                        onClick={() => setShowShareDialog(true)}
                    >
                        <MdShare size={20} />
                        Share
                    </button>
                </div>
            </div>
            {/* Dialog Share */}
            {showShareDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-semibold mb-4">Share Todo List</h2>
                        <div className="mb-4">
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded"
                                value={shareLink}
                                readOnly
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => setShowShareDialog(false)}
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() => {
                                    navigator.clipboard.writeText(shareLink);
                                    setShowShareDialog(false);
                                }}
                            >
                                Copy Link
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <DragDropContext onDragEnd={onDragEnd}>
                <div
                    className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-4 pb-4 w-full flex-1`}
                    style={{
                        flexWrap: isMobile ? "nowrap" : "wrap",
                        overflowY: isMobile ? "visible" : "visible",
                        overflowX: isMobile ? "visible" : "auto",
                    }}
                >
                    {lists.map(list => (
                        <Droppable droppableId={String(list.id)} key={list.id}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-white rounded-lg shadow w-full max-w-xs p-4 flex-shrink-0 relative"
                                    style={{
                                        minWidth: isMobile ? "100%" : "18rem",
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">{list.title}</span>
                                        <div className="relative">
                                            <button
                                                className="text-gray-400 hover:text-gray-600 p-1"
                                                onClick={() => {
                                                    if (activeListMenu === list.id) {
                                                        setActiveListMenu(null);
                                                        setEditingListId(null);
                                                    } else {
                                                        setActiveListMenu(list.id);
                                                        setRenameTitle(list.title);
                                                    }
                                                }}
                                            >
                                                <MdMoreVert size={22} />
                                            </button>
                                            {activeListMenu === list.id && (
                                                <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow-lg border z-50">
                                                    {/* Tombol Rename */}
                                                    <button
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-100"
                                                        onClick={() => setEditingListId(list.id)}
                                                    >
                                                        <MdEdit className="text-blue-500" size={18} />
                                                        Rename
                                                    </button>
                                                    {/* Input Rename hanya muncul saat mode edit */}
                                                    {editingListId === list.id && (
                                                        <div className="px-3 py-2">
                                                            <input
                                                                type="text"
                                                                className="border rounded px-2 py-1 w-full text-sm"
                                                                value={renameTitle}
                                                                onChange={e => setRenameTitle(e.target.value)}
                                                                onClick={e => e.stopPropagation()}
                                                            />
                                                            <button
                                                                className="mt-2 w-full bg-blue-600 text-white rounded px-2 py-1 text-xs hover:bg-blue-700"
                                                                onClick={() => handleRenameList(list.id)}
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    )}
                                                    {/* Tombol Delete */}
                                                    <button
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-100 text-red-600"
                                                        onClick={() => handleDeleteList(list.id)}
                                                    >
                                                        <MdDelete size={18} />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-2">
                                        {list.cards.map((card, idx) => (
                                            <Draggable key={card.id} draggableId={String(card.id)} index={idx}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-gray-100 rounded px-3 py-2 text-sm flex justify-between items-center"
                                                    >
                                                        <span>{card.title}</span>
                                                        <button
                                                            className="ml-2 text-red-500 hover:text-red-700"
                                                            onClick={() => handleDeleteCard(list.id, card.id)}
                                                        >
                                                            <MdDelete size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1 text-sm"
                                            placeholder="+ Add a card"
                                            value={newCardText[list.id] || ""}
                                            onChange={e =>
                                                setNewCardText({ ...newCardText, [list.id]: e.target.value })
                                            }
                                        />
                                        <button
                                            className="text-blue-600 text-xs font-semibold hover:underline text-left"
                                            onClick={() => handleAddCard(list.id)}
                                        >
                                            Add a card
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                    {/* Add another list */}
                    <div
                        className="bg-slate-200 rounded-lg w-full max-w-xs p-4 flex-shrink-0 flex flex-col justify-center items-center"
                        style={{
                            minWidth: isMobile ? "100%" : "18rem",
                        }}
                    >
                        <input
                            type="text"
                            className="border rounded px-2 py-1 text-sm mb-2 w-full"
                            placeholder="+ Add another list"
                            value={newListTitle}
                            onChange={e => setNewListTitle(e.target.value)}
                        />
                        <button
                            className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-100"
                            onClick={handleAddList}
                        >
                            Add List
                        </button>
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};

export default TodoBoard;