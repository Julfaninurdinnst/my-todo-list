import { Routes, Route } from "react-router-dom";
import TodoBoard from "../pages/Todo-Board";
import Home from "../pages/Home";
import SearchResult from "../pages/SearchResult";

const Content = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todo/:id" element={<TodoBoard />} />
            <Route path="/search" element={<SearchResult />} />
        </Routes>
    );
};

export default Content;