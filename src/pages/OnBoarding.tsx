import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    toast("Event has been created", { position: "top-center" });
  }, []);

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.email.trim()) newErrors.email = "Required";
    if (!form.phone.trim()) newErrors.phone = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      navigate("/onboarding/step-2");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: "#F9FAFB" }}>
      {/* Background blurred circles */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(219, 234, 254, 0.30)",
          filter: "blur(64px)",
          right: "-128px",
          top: "-256px",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(224, 231, 255, 0.30)",
          filter: "blur(64px)",
          left: "-256px",
          bottom: "-200px",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full mx-4 flex flex-col overflow-hidden"
        style={{
          maxWidth: 672,
          borderRadius: 40,
          border: "1px solid #F3F4F6",
          background: "#FFF",
          boxShadow: "0 30px 60px 0 rgba(0,0,0,0.06)",
        }}>
        {/* Progress bar */}
        <div className="w-full flex" style={{ height: 6, background: "#F3F4F6", flexShrink: 0 }}>
          <div
            style={{
              width: "50%",
              height: 6,
              background: "#1C398E",
              transition: "width 0.4s ease",
            }}
          />
        </div>

        {/* Form content */}
        <div className="flex flex-col" style={{ padding: "48px 48px 48px 48px" }}>
          {/* Step badge */}
          <div
            className="inline-flex items-center gap-2 self-start"
            style={{
              padding: "4.5px 13px 3.5px 12px",
              borderRadius: 9999,
              background: "#EFF6FF",
            }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.5 10.5V9.5C9.5 8.96957 9.28929 8.46086 8.91421 8.08579C8.53914 7.71071 8.03043 7.5 7.5 7.5H4.5C3.96957 7.5 3.46086 7.71071 3.08579 8.08579C2.71071 8.46086 2.5 8.96957 2.5 9.5V10.5"
                stroke="#1C398E"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 5.5C7.10457 5.5 8 4.60457 8 3.5C8 2.39543 7.10457 1.5 6 1.5C4.89543 1.5 4 2.39543 4 3.5C4 4.60457 4.89543 5.5 6 5.5Z"
                stroke="#1C398E"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                color: "#1C398E",
                fontFamily: "Inter, sans-serif",
                fontSize: 10,
                fontWeight: 900,
                lineHeight: "15px",
                letterSpacing: "1.117px",
                textTransform: "uppercase",
              }}>
              Step 1 of 2
            </span>
          </div>

          {/* Heading */}
          <h2
            className="mt-5"
            style={{
              color: "#101828",
              fontFamily: "Inter, sans-serif",
              fontSize: 30,
              fontWeight: 900,
              lineHeight: "36px",
              letterSpacing: "-0.354px",
            }}>
            Personal Information
          </h2>

          {/* Subtitle */}
          <p
            className="mt-3"
            style={{
              color: "#6A7282",
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontWeight: 500,
              lineHeight: "24px",
              letterSpacing: "-0.312px",
            }}>
            Please provide accurate details to personalize your experience.
          </p>

          {/* Fields */}
          <div className="flex flex-col gap-6 mt-12">
            {/* First Name + Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FieldWrapper label="First Name" error={errors.firstName}>
                <input
                  type="text"
                  placeholder="Alex"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="onboarding-input"
                  style={inputStyle}
                />
              </FieldWrapper>
              <FieldWrapper label="Last Name" error={errors.lastName}>
                <input
                  type="text"
                  placeholder="Johnson"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="onboarding-input"
                  style={inputStyle}
                />
              </FieldWrapper>
            </div>

            {/* Email */}
            <FieldWrapper label="Email Address (Google)" error={errors.email}>
              <input
                type="email"
                placeholder="alex.johnson@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ ...inputStyle, background: "#F3F4F6" }}
              />
            </FieldWrapper>

            {/* Mobile Number */}
            <FieldWrapper label="Mobile Number" error={errors.phone}>
              <div
                className="flex items-center"
                style={{
                  ...inputStyle,
                  padding: 0,
                  overflow: "hidden",
                }}>
                <span
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    padding: "16px 0 16px 20px",
                    color: "#101828",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: "-0.312px",
                    whiteSpace: "nowrap",
                  }}>
                  +91
                </span>
                <div
                  style={{
                    width: 1,
                    height: 24,
                    background: "#E5E7EB",
                    margin: "0 16px",
                    flexShrink: 0,
                  }}
                />
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "rgba(16,24,40,0.5)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: "-0.312px",
                    paddingRight: 20,
                  }}
                />
              </div>
            </FieldWrapper>
          </div>

          {/* Next Step Button */}
          <button
            onClick={handleNext}
            className="w-full mt-8 hover:opacity-90 active:opacity-80 transition-opacity"
            style={{
              height: 60,
              borderRadius: 9999,
              background: "#1C398E",
              color: "#FFF",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: "1.25px",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
            }}>
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 58,
  padding: "16px 20px",
  borderRadius: 16,
  border: "1px solid #F3F4F6",
  background: "#F9FAFB",
  color: "rgba(16,24,40,0.5)",
  fontFamily: "Inter, sans-serif",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: "-0.312px",
  outline: "none",
  display: "block",
};

function FieldWrapper({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label
        style={{
          color: "#99A1AF",
          fontFamily: "Inter, sans-serif",
          fontSize: 10,
          fontWeight: 900,
          lineHeight: "15px",
          letterSpacing: "1.117px",
          textTransform: "uppercase",
          paddingLeft: 4,
        }}>
        {label}
      </label>
      {children}
      {error && (
        <span
          style={{
            color: "#EF4444",
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            paddingLeft: 4,
          }}>
          {error}
        </span>
      )}
    </div>
  );
}
