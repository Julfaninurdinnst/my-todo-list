import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-row">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"
          } max-h-min bg-gray-100`}
      >
        <Header />
        <Routes>
          <Route path="/*" element={<Content />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
