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
import { useDispatch, useSelector } from "react-redux";
import Members from "./pages/members";
import VerificationDetails from "./pages/verificationDetails";
import { useEffect, useState } from "react";
import VerifyAccount from "./pages/verifyAccount";
import Lottie from "react-lottie";
import animationData from "./assets/money2.json";
import logo from "./assets/images/caiif-logo.svg";
import { setApproveMembers } from "./store/membersSlice/membersSlice";
import { API_URL } from "./config/api";
import axios from "axios";
import { setCommittees } from "./store/committeeSlice/committeeSlice";
import Setup2 from "./pages/Setup2";
import SignUp2 from "./pages/signup2";
import SignUp3 from "./pages/signup3";
import NewPassword from "./pages/new-password";
import PaymentHistory from "./pages/paymentHistory";
import ResetPassword from "./pages/resetPassword";

function App() {

  // const [loading, setLoading] = useState(true)
  const token = useSelector((state) => state.common.token)
  // const user = useSelector((state) => state.auth.user)
  // const dispatch = useDispatch()
  // const location = useLocation()
  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData, // the animation data
  //   rendererSettings: {
  //     preserveAspectRatio: 'xMidYMid slice',
  //   },
  // };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 5000);
  // }, [])

  return (

    <div className="App">

      {/* {loading ? (
        <div style={{ padding: "20px" }}>
          <div style={{ minHeight: "90vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", position: "relative" }}>
            <img src={logo} />
            <Lottie options={defaultOptions} height={400} width={400} />
          </div>
        </div>
      ) : ( */}
        <Routes>
          <Route path="/sign-up1/:cid" exact element={!token ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/sign-up2/:cid" exact element={!token ? <SignUp2 /> : <Navigate to="/" />} />
          <Route path="/sign-up3/:cid" exact element={!token ? <SignUp3 /> : <Navigate to="/" />} />
          <Route path="/sign-in" exact element={!token ? <SignIn /> : <Navigate to="/" />} />
          <Route path="/new-password/:id/:email" exact element={<NewPassword />} />
          <Route path="/create-account/:id/:email" element={<VerifyAccount />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Main />}>
            <Route path="/" element={token ? <Home /> : <Navigate to="/sign-in" />} />
            <Route path="/members" element={token ? <Members /> : <Navigate to="/sign-in" />} />
            <Route path="/view-committee/:id" element={token ? <Setup2 /> : <Navigate to="/sign-in" />} />
            <Route path="/view-all-committee" element={token ? <Setup /> : <Navigate to="/sign-in" />} />
            <Route path="/members/verification-details/:id" element={token ? <VerificationDetails /> : <Navigate to="/sign-in" />} />
            <Route path="/committee-details" element={token ? <CommitteeDetails /> : <Navigate to="/sign-in" />} />
            <Route path="/payment-history" element={token ? <PaymentHistory /> : <Navigate to="/sign-in" />} />
            <Route path="/profile" element={token ? <Profile /> : <Navigate to="/sign-in" />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      {/* )} */}

    </div>

  );

}

export default App;