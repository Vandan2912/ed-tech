import { useEffect, useState } from "react";
import { useAuth } from "@/auth/useAuth";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/loader";
import LoginForm from "@/components/Login/login_form";
import Forgot from "@/components/Login/forgot";
import CheckEmail from "@/components/Login/check_email";
import { AuthShell } from "@/components/auth/AuthCard";
import { Logo } from "@/components/auth/Logo";

type Stage = "login" | "forgot" | "checkEmail";

export default function Login() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [stage, setStage] = useState<Stage>("login");
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthShell maxWidthClassName="max-w-[448px]">
      {loader && <Loader />}

      <div className="flex flex-col items-center gap-6 p-6 sm:p-10 text-center">
        <Logo />

        {stage === "login" && (
          <>
            <p className="text-[15px] font-semibold text-[#0a0a0a] sm:whitespace-nowrap">
              Make every lesson count with AI-powered education.
            </p>
            <LoginForm
              setLoading={setLoader}
              onForgotPassword={() => setStage("forgot")}
            />
          </>
        )}

        {stage === "forgot" && (
          <Forgot
            onEmailSubmit={(email) => {
              setForgotEmail(email);
              setStage("checkEmail");
            }}
            onBackToLogin={() => setStage("login")}
          />
        )}

        {stage === "checkEmail" && (
          <CheckEmail
            email={forgotEmail}
            onBackToLogin={() => setStage("login")}
          />
        )}
      </div>
    </AuthShell>
  );
}
