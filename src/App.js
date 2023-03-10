import "./input.css";
import { BVBStatsProvider } from "./context/BVBStatsContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Import from "./pages/Import";
import Team from "./pages/Team";
import MatchVideo from "./pages/MatchVideo";

function App() {
  return (
    <BVBStatsProvider>
      <Router>
        <div className="flex flex-col h-screen">
          <Navbar />
          <main className="container mx-auto px-3 pb-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/import" element={<Import />} />
              <Route path="/team" element={<Team />} />
              <Route path="/matchvideo" element={<MatchVideo />} />
              <Route path="/about" element={<About />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer />
      </Router>
    </BVBStatsProvider>
  );
}

export default App;
