import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Home from "./pages/Home";

export default function App() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div>
      <Header />
      <ToastContainer />
      <Container className="my-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={userInfo ? <Profile /> : <Navigate to={"/"} />}
          />
        </Routes>
      </Container>
    </div>
  );
}
