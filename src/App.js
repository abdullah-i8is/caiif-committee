import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Setup from "./pages/Setup";
import City from "./pages/City";
import Users from "./pages/users";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/reset.css";
// import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { useSelector } from "react-redux";
import TripDetail from "./pages/TripDetails";
import AddEmployess from "./pages/AddTrips";
import Employee from "./pages/ListOfEmployee";
import TripSummary from "./pages/TripSummary";
import EditTrips from "./pages/EditTrips";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { notification } from "antd";
import SelectDetails from "./pages/SelectDetails";
import ManagmentHome from "./pages/ManagmentHome";
import ExpensePolicy from './pages/ExpensesPolicy'
import Members from "./pages/members";
import VerificationDetails from "./pages/verificationDetails";
import CommitteeDetails from "./pages/committeeDetails";
import EnrollRequests from "./pages/enrollRequests";

function App() {

  const token = useSelector((state) => state.common.token)
  const loginUser = useSelector((state) => state.auth.user)
  const [api, contextHolder] = notification.useNotification();

  return (

    <div className="App">

      {contextHolder}

      <Routes>

        <Route path="/sign-up" exact element={!token ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/sign-in" exact element={!token ? <SignIn /> : <Navigate to="/" />} />

        <Route path="/" element={<Main />}>

          <Route path="/" element={!token ? <Home /> : <Navigate to="/sign-in" />} />
          <Route path="/view-all-committee" element={!token ? <Setup /> : <Navigate to="/sign-in" />} />
          <Route path="/members" element={!token ? <Members /> : <Navigate to="/sign-in" />} />
          <Route path="/verification-details" element={!token ? <VerificationDetails /> : <Navigate to="/sign-in" />} />
          <Route path="/committee-details" element={!token ? <CommitteeDetails /> : <Navigate to="/sign-in" />} />
          <Route path="/enroll-requests" element={!token ? <EnrollRequests /> : <Navigate to="/sign-in" />} />

          {/* <Route path="/edit-trip" element={!token ? <EditTrips /> : <Navigate to="/sign-in" />} />
          <Route path="/users" element={!token ? <Users /> : <Navigate to="/sign-in" />} />
          <Route path="/city" element={!token ? <City /> : <Navigate to="/sign-in" />} />
          <Route path="/trip-summary" element={!token ? <TripSummary /> : <Navigate to="/sign-in" />} />
          <Route path="/employee" element={!token ? <Employee /> : <Navigate to="/sign-in" />} />
          <Route path="/trip-detail" element={!token ? <SelectDetails /> : <Navigate to="/sign-in" />} />
          <Route path="/expanse" element={!token ? <ExpensePolicy /> : <Navigate to="/sign-in" />} />
          <Route path="/" element={!token ? <ManagmentHome /> : <Navigate to="/sign-in" />} />
          <Route path="/trip-detail" element={!token ? <SelectDetails /> : <Navigate to="/sign-in" />} />
          <Route path="/" element={!token ? <Home /> : <Navigate to="/sign-in" />} />
          <Route path="/addTrips" element={!token ? <AddEmployess /> : <Navigate to="/sign-in" />} />
          <Route path="/add-trip-detail" element={!token ? <TripDetail /> : <Navigate to="/sign-in" />} />
          <Route path="/trip-detail" element={!token ? <SelectDetails /> : <Navigate to="/sign-in" />} />
          <Route path="/" element={!token ? <Home /> : <Navigate to="/sign-in" />} />
          <Route path="/add-trip-detail" element={!token ? <TripDetail /> : <Navigate to="/sign-in" />} />
          <Route path="/trip-detail" element={!token ? <SelectDetails /> : <Navigate to="/sign-in" />} />
          <Route path="/profile" element={!token ? <Profile /> : <Navigate to="/sign-in" />} /> */}

        </Route>

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </div>

  );

}

export default App;