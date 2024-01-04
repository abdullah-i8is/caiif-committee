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
import { useEffect } from "react";

function App() {

  const token = useSelector((state) => state.common.token)
  const user = useSelector((state) => state.auth.user)

  console.log(token);
  console.log(user);

  return (

    <div className="App">

      <Routes>

        <Route path="/sign-up" exact element={!token ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/sign-in" exact element={!token ? <SignIn /> : <Navigate to="/" />} />

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

    </div>

  );

}

export default App;