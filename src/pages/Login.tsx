import { useEffect, useState } from "react";
import Forgot from "@/components/Login/forgot";
import ForgotOtp from "@/components/Login/forgot_otp";
import CreateNewPassword from "@/components/Login/new_password";
import { useAuth } from "@/auth/useAuth";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/loader";
import RoleToggle from "@/components/Login/role_toggle";
import StudentLogin from "@/components/Login/student_login";
import TeacherLoginForm from "@/components/Login/teacher_login";

type Role = "student" | "teacher";

export default function Login() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [role, setRole] = useState<Role>("student");
  const [forgotEmail, setForgotEmail] = useState("");
  const [stage, setStage] = useState({
    forgot: false,
    forgotOTP: false,
    newPassword: false,
  });

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  /* ---- Forgot-password flow content ---- */
  const renderForgotFlow = () => {
    if (stage.newPassword) {
      return <CreateNewPassword setStage={setStage} />;
    }
    if (stage.forgotOTP) {
      return <ForgotOtp setStage={setStage} email={forgotEmail} />;
    }
    return <Forgot setStage={setStage} onEmailSubmit={setForgotEmail} />;
  };

  /* ---- Main login content ---- */
  const renderLoginContent = () => (
    <>
      {/* Logo */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#120B6E] rounded-[20px] sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl shadow-blue-100 transition-colors duration-300">
        <img src="/favicon.svg" alt="Mastishq.ai" className="h-10 w-auto" />
      </div>

      {/* Title & Subtitle */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl! font-black! text-gray-900! mb-2 sm:mb-3! mt-0! tracking-tight!">
          Mastishq.ai
        </h1>
        <p className="text-sm sm:text-base text-gray-500 font-medium!">
          Join the next generation of learners.{" "}
          <br className="hidden sm:block" />
          Experience AI-powered education.
        </p>
      </div>

      {/* Role Toggle */}
      <RoleToggle role={role} setRole={setRole} />

      {/* Sign In + Terms */}
      <div className="space-y-6">
        {role === "student" ? (
          <StudentLogin setLoading={setLoader} />
        ) : (
          <TeacherLoginForm
            setLoading={setLoader}
            onForgotPassword={() =>
              setStage((prev) => ({ ...prev, forgot: true }))
            }
          />
        )}

        {/* Terms */}
        <div
          className="text-[10px] text-gray-400 font-bold! uppercase tracking-widest leading-loose"
          style={{ gap: 0 }}>
          <p className="text-center">By continuing, you agree to our</p>
          <p className="text-center">
            <a href="#" className="text-blue-900 cursor-pointer">
              Terms of Service
            </a>
            <span style={{ color: "#99A1AF" }}> and </span>
            <a href="#" className="text-blue-900 cursor-pointer">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div
      className="min-h-dvh w-screen flex flex-col items-center justify-center relative overflow-x-hidden p-4 sm:p-8"
      style={{ background: "#F9FAFB" }}>
      {loader && <Loader />}

      {/* Background blurred circles */}
      <div className="absolute pointer-events-none w-[24rem] h-96 rounded-full bg-blue-100/50 blur-3xl -right-24 -top-48 hidden sm:block" />
      {/* <div className="absolute pointer-events-none w-[24rem] h-96 rounded-full bg-blue-100/50 blur-3xl -left-48 -bottom-48 hidden sm:block" /> */}

      {/* Card */}
      <div className="bg-white rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 text-center relative z-10 mx-auto">
        {stage.forgot ? renderForgotFlow() : renderLoginContent()}
      </div>
    </div>
  );
}
