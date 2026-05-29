import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Loader2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/useAuth";
import type { User } from "@/auth/AuthProvider";
import {
  getClasses,
  getSchools,
  saveAcademicDetails,
  type ClassOption,
  type School,
} from "@/api/user";
import CustomSelect from "@/components/CustomSelect";
import { OtpVerifyModal } from "@/components/profile/OtpVerifyModal";

/** Fields that can be edited inline on this page. */
type EditableKey = "email" | "contact_number" | "school_name" | "std" | "district";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [editingField, setEditingField] = useState<EditableKey | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  // True when "Other" is chosen for school name, revealing a free-text input.
  const [schoolOther, setSchoolOther] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);

  useEffect(() => {
    let cancelled = false;
    getSchools()
      .then((list) => {
        if (!cancelled) setSchools(list);
      })
      .catch((err) => console.error("Failed to load schools", err));
    getClasses()
      .then((list) => {
        if (!cancelled) setClasses(list);
      })
      .catch((err) => console.error("Failed to load classes", err));
    return () => {
      cancelled = true;
    };
  }, []);

  const schoolOptions = useMemo(
    () => [
      ...schools.map((s) => ({ label: s.name, value: s.name })),
      { label: "Other", value: "Other" },
    ],
    [schools]
  );

  // The backend stores `std` as the raw number, so strip the "Class " prefix the API returns.
  const classOptions = useMemo(
    () =>
      classes.map((c) => ({
        label: c.name,
        value: c.name.replace(/^Class\s+/i, "").trim(),
      })),
    [classes]
  );

  // OTP verification for mobile-number changes (sent to WhatsApp).
  const [otpOpen, setOtpOpen] = useState(false);
  const [pendingMobile, setPendingMobile] = useState("");
  const [verifying, setVerifying] = useState(false);

  const mobile = user?.contact_number || user?.mobile_number || "";

  const startEdit = (field: EditableKey, current: string) => {
    setEditingField(field);
    setDraft(current);
    // A saved school not in the preset list counts as a custom ("Other") entry.
    if (field === "school_name") {
      setSchoolOther(Boolean(current) && !schoolOptions.some((o) => o.value === current));
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setDraft("");
    setSchoolOther(false);
  };

  /** Build the full payload the save endpoint expects, applying an override. */
  const buildPayload = (overrides: Partial<Record<EditableKey, string>>) => ({
    id: user?.id,
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    school_name: user?.school_name ?? "",
    std: user?.std ?? "",
    pincode: user?.pincode ?? "",
    district: user?.district ?? "",
    state: user?.state ?? "",
    country: user?.country ?? "",
    contact_number: mobile,
    ...overrides,
  });

  const persist = async (overrides: Partial<Record<EditableKey, string>>) => {
    await saveAcademicDetails(buildPayload(overrides));
    setUser({ ...(user as User), ...overrides });
  };

  const handleSave = async (field: EditableKey) => {
    const value = draft.trim();
    // Mobile changes require WhatsApp OTP verification before they persist.
    if (field === "contact_number") {
      if (!value || value === mobile) return cancelEdit();
      setPendingMobile(value);
      cancelEdit();
      setOtpOpen(true);
      return;
    }

    setSaving(true);
    try {
      await persist({ [field]: value });
      toast.success("Profile updated");
      cancelEdit();
    } catch {
      toast.error("Couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleOtpVerify = async () => {
    setVerifying(true);
    try {
      await persist({ contact_number: pendingMobile });
      toast.success("Mobile number updated");
      setOtpOpen(false);
    } catch {
      toast.error("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-3xl font-black tracking-[0.4px] text-[#101828]">Profile</h1>

        {/* Personal Information */}
        <Section icon={<UserIcon size={20} className="text-[#155dfc]" />} title="Personal Information">
          <Field label="First Name" value={user?.first_name} />
          <Field label="Last Name" value={user?.last_name} />
          <Field
            label="Email"
            value={user?.email}
            editable
            editing={editingField === "email"}
            draft={draft}
            saving={saving}
            inputMode="email"
            onDraftChange={setDraft}
            onStartEdit={() => startEdit("email", user?.email ?? "")}
            onSave={() => handleSave("email")}
            onCancel={cancelEdit}
          />
          <Field
            label="Mobile Number"
            value={mobile}
            editable
            editing={editingField === "contact_number"}
            draft={draft}
            saving={saving}
            inputMode="tel"
            onDraftChange={setDraft}
            onStartEdit={() => startEdit("contact_number", mobile)}
            onSave={() => handleSave("contact_number")}
            onCancel={cancelEdit}
          />
        </Section>

        {/* School Information */}
        <Section icon={<GraduationCap size={20} className="text-[#155dfc]" />} title="School Information">
          <Field
            label="School Name"
            value={user?.school_name}
            editable
            editing={editingField === "school_name"}
            saving={saving}
            onStartEdit={() => startEdit("school_name", user?.school_name ?? "")}
            onSave={() => handleSave("school_name")}
            onCancel={cancelEdit}
            editControl={
              <div className="flex flex-col gap-2">
                <CustomSelect
                  value={schoolOther ? "Other" : schoolOptions.some((o) => o.value === draft) ? draft : ""}
                  placeholder="Select your school"
                  options={schoolOptions}
                  onChange={(val) => {
                    if (val === "Other") {
                      setSchoolOther(true);
                      setDraft("");
                    } else {
                      setSchoolOther(false);
                      setDraft(val);
                    }
                  }}
                />
                {schoolOther && (
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type your school name..."
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 font-bold text-gray-900 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                )}
              </div>
            }
          />
          <Field
            label="Standard/Class"
            value={user?.std ? `Class ${user.std}` : ""}
            editable
            editing={editingField === "std"}
            saving={saving}
            onStartEdit={() => startEdit("std", user?.std ?? "")}
            onSave={() => handleSave("std")}
            onCancel={cancelEdit}
            editControl={
              <CustomSelect
                value={draft}
                placeholder="Select your class"
                options={classOptions}
                onChange={setDraft}
              />
            }
          />
          <Field
            label="City/District"
            value={user?.district}
            editable
            editing={editingField === "district"}
            draft={draft}
            saving={saving}
            onDraftChange={setDraft}
            onStartEdit={() => startEdit("district", user?.district ?? "")}
            onSave={() => handleSave("district")}
            onCancel={cancelEdit}
          />
          <Field label="State" value={user?.state} />
          <Field label="PIN Code" value={user?.pincode} />
          <Field label="Country" value={user?.country} />
        </Section>
      </div>

      <OtpVerifyModal
        open={otpOpen}
        onOpenChange={setOtpOpen}
        verifying={verifying}
        onVerify={handleOtpVerify}
        onResend={() => toast.info("A new OTP has been sent to your WhatsApp")}
      />
    </div>
  );
}

/* ---------------- SECTION CARD ---------------- */

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 flex flex-col gap-6 rounded-3xl border border-[#f3f4f6] bg-white p-6 drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-black tracking-[-0.45px] text-[#101828]">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

/* ---------------- FIELD ---------------- */

function Field({
  label,
  value,
  editable = false,
  editing = false,
  draft = "",
  saving = false,
  inputMode,
  editControl,
  onDraftChange,
  onStartEdit,
  onSave,
  onCancel,
}: {
  label: string;
  value?: string | null;
  editable?: boolean;
  editing?: boolean;
  draft?: string;
  saving?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  /** Custom editor (e.g. a dropdown). When provided it replaces the text input. */
  editControl?: React.ReactNode;
  onDraftChange?: (value: string) => void;
  onStartEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  const actionButtons = (
    <>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="flex h-8 shrink-0 items-center justify-center gap-1 rounded-[14px] bg-[#155dfc] px-4 text-xs font-bold text-white transition-colors hover:bg-[#0e44c7] disabled:opacity-60">
        {saving ? <Loader2 className="size-3.5 animate-spin" /> : "Save"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="h-8 shrink-0 rounded-[14px] bg-[#e5e7eb] px-4 text-xs font-bold text-[#364153] transition-colors hover:bg-gray-300 disabled:opacity-60">
        Cancel
      </button>
    </>
  );

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-[#f9fafb] p-4">
      <span className="text-xs font-black uppercase tracking-[1.2px] text-[#99a1af]">{label}</span>

      {editing && editControl ? (
        <div className="flex flex-col gap-2">
          {editControl}
          <div className="flex items-center gap-2">{actionButtons}</div>
        </div>
      ) : editing ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={draft}
            inputMode={inputMode}
            onChange={(e) => onDraftChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave?.();
              if (e.key === "Escape") onCancel?.();
            }}
            className="min-w-0 flex-1 rounded-[14px] border-2 border-[#8ec5ff] bg-white px-3 py-2 text-base font-bold text-[#101828] outline-none transition-colors focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100"
          />
          {actionButtons}
        </div>
      ) : (
        <div className="flex min-h-6 items-center justify-between gap-2">
          <span className="break-all text-base font-bold tracking-[-0.31px] text-[#101828]">
            {value || "Not provided"}
          </span>
          {editable && (
            <button
              type="button"
              onClick={onStartEdit}
              className="shrink-0 rounded-[10px] bg-[#eff6ff] px-2.5 py-1 text-xs font-bold text-[#155dfc] transition-colors hover:bg-blue-100">
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
}
