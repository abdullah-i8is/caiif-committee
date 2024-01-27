import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import VerifyAccount from "./pages/verifyAccount";
import Setup2 from "./pages/Setup2";
import SignUp2 from "./pages/signup2";
import SignUp3 from "./pages/signup3";
import NewPassword from "./pages/new-password";
import ResetPassword from "./pages/resetPassword";
import ApprovedMembers from "./pages/approvedMembers";
import PayoutHistory from "./pages/payoutHistory";
import InstallmentHistory from "./pages/installmentHistory";
import PaymentHistory from "./pages/paymentHistory";

function App() {

  // const [loading, setLoading] = useState(true)
  const token = useSelector((state) => state.common.token)

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
          <Route path="/sign-up1/:cid" exact element={!token ? <SignUp /> : <Navigate to="/dashboard" />} />
          <Route path="/sign-up2/:cid" exact element={!token ? <SignUp2 /> : <Navigate to="/dashboard" />} />
          <Route path="/sign-up3/:cid" exact element={!token ? <SignUp3 /> : <Navigate to="/dashboard" />} />
          <Route path="/sign-in" exact element={!token ? <SignIn /> : <Navigate to="/dashboard" />} />
          <Route path="/new-password/:id/:email" exact element={<NewPassword />} />
          <Route path="/create-account/:id/:email" element={<VerifyAccount />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Main />}>
            <Route path="/dashboard" element={token ? <Home /> : <Navigate to="/sign-in" />} />
            <Route path="/members" element={token ? <Members /> : <Navigate to="/sign-in" />} />
            <Route path="/approved-members" element={token ? <ApprovedMembers /> : <Navigate to="/sign-in" />} />
            <Route path="/dashboard/view-committee/:id" element={token ? <Setup2 /> : <Navigate to="/sign-in" />} />
            <Route path="/view-all-committee" element={token ? <Setup /> : <Navigate to="/sign-in" />} />
            <Route path="/members/verification-details/:id" element={token ? <VerificationDetails /> : <Navigate to="/sign-in" />} />
            <Route path="/approved-members/verification-details/:id" element={token ? <VerificationDetails /> : <Navigate to="/sign-in" />} />
            <Route path="/dashboard/committee-details" element={token ? <CommitteeDetails /> : <Navigate to="/sign-in" />} />
            <Route path="/payment-history" element={token ? <PaymentHistory /> : <Navigate to="/sign-in" />} />
            <Route path="/payout-history" element={token ? <PayoutHistory /> : <Navigate to="/sign-in" />} />
            <Route path="/installment-history" element={token ? <InstallmentHistory /> : <Navigate to="/sign-in" />} />
            <Route path="/profile" element={token ? <Profile /> : <Navigate to="/sign-in" />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      {/* )} */}
    </div>
  );
}

export default App;