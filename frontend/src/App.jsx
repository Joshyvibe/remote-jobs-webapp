import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import NotFound from "./pages/Notfound";
import Home from "./pages/Home";
import JobDetail from "./components/JobDetail";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import AuthPage from "./pages/AuthPage"
import { useAuthentication } from "./auth"
import VerifyEmail from "./components/VerifyEmail";
import Profile from "./pages/Profile";
import JobEdit from "./components/JobEdit";
import Companies from "./components/Companies";
import TermsAndConditions from "./pages/TermsAndConditions";
import PasswordReset from "./components/PasswordReset";
import PasswordResetConfirm from "./components/PasswordResetConfirm";

function App() {

  const {isAuthorized} = useAuthentication()
  const ProtectedLogin = () => {
    return isAuthorized ? <Navigate to='/' /> : <AuthPage initialMethod='login' />
  }
  const ProtectedRegister = () => {
    return isAuthorized ? <Navigate to='/' /> : <AuthPage initialMethod='register' />
  }
 
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/post-job" element={<JobForm />} />
          <Route path="/jobs" element={<JobList />} /> {/* General job list */}
          <Route path="/company/:companyName/jobs" element={<JobList />} /> {/* Company-specific jobs */}
          <Route path="/login" element={<ProtectedLogin />}/>
          <Route path="/register" element={<ProtectedRegister />}/>
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobs/:id/edit" element={<JobEdit />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/password-reset" element={<PasswordReset />} /> 
          <Route path="/password-reset-confirm/:uidb64/:token" element={<PasswordResetConfirm />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;