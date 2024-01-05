import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Setup from "./pages/Setup";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import CommitteeDetails from "./pages/committeeDetails";
import Main from "./components/layout/Main";
import "antd/dist/reset.css";
// import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { useSelector } from "react-redux";
import Members from "./pages/members";
import VerificationDetails from "./pages/verificationDetails";
import { useEffect, useState } from "react";
import VerifyAccount from "./pages/verifyAccount";
import Lottie from "react-lottie";
import animationData from "./assets/money.json";
import logo from "./assets/images/caiif-logo.svg";

function App() {

  const [loading, setLoading] = useState(true)
  const token = useSelector((state) => state.common.token)
  const user = useSelector((state) => state.auth.user)
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData, // the animation data
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 5000);
  }, [])

  return (

    <div className="App">

      {loading ? (
        <div style={{ padding: "20px" }}>
          <div style={{ minHeight: "65vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", position: "relative" }}>
            <Lottie options={defaultOptions} height={500} width={500} />
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/sign-up" exact element={!token ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/sign-in" exact element={!token ? <SignIn /> : <Navigate to="/" />} />
          <Route path="/create-account/:id/:email" element={<VerifyAccount />} />
          <Route path="/" element={<Main />}>
            <Route path="/" element={token ? <Home /> : <Navigate to="/sign-in" />} />
            <Route path="/members" element={token ? <Members /> : <Navigate to="/sign-in" />} />
            <Route path="/view-all-committee" element={token ? <Setup /> : <Navigate to="/sign-in" />} />
            <Route path="/verification-details/:id" element={token ? <VerificationDetails /> : <Navigate to="/sign-in" />} />
            <Route path="/committee-details" element={token ? <CommitteeDetails /> : <Navigate to="/sign-in" />} />
            <Route path="/profile" element={token ? <Profile /> : <Navigate to="/sign-in" />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}

    </div>

  );

}

export default App;