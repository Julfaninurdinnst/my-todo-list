import { useLocation, useNavigate } from "react-router-dom";
import type { Board, Card } from "../lib/types";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchResult = () => {
    const query = useQuery();
    const search = query.get("q")?.toLowerCase() || "";
    const navigate = useNavigate();

    const boards: Board[] = JSON.parse(localStorage.getItem("my-todo-boards") || "[]");

    // Cari semua card yang cocok dengan query
    const results: { boardId: string; boardTitle: string; listTitle: string; card: Card }[] = [];
    boards.forEach(board => {
        board.lists.forEach(list => {
            list.cards.forEach(card => {
                if (card.title?.toLowerCase().includes(search)) {
                    results.push({
                        boardId: board.id,
                        boardTitle: board.title,
                        listTitle: list.title,
                        card,
                    });
                }
            });
        });
    });

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Search results for: <span className="text-blue-600">{search}</span></h2>
            {results.length === 0 && <div>No cards found.</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((result, idx) => (
                    <div key={idx} className="bg-white rounded shadow p-4">
                        <div className="text-xs text-gray-500 mb-1">Board: {result.boardTitle}</div>
                        <div className="text-xs text-gray-500 mb-1">List: {result.listTitle}</div>
                        <div className="font-semibold mb-2">{result.card.title}</div>
                        <button
                            className="text-blue-600 text-xs underline"
                            onClick={() => navigate(`/todo/${result.boardId}`)}
                        >
                            Go to board
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResult;