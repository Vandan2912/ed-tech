import { api } from "@/lib/api";

export type School = {
  id: string;
  name: string;
};

export type ClassOption = {
  id: string;
  name: string;
};

/** Fetches the list of schools students can select during onboarding/profile editing. */
export const getSchools = async (): Promise<School[]> => {
  const res = await api.get<{ success: boolean; data: School[] }>(
    "/academic/student/schools"
  );
  return res.data?.data ?? [];
};

/** Fetches the list of classes (standards) students can select. */
export const getClasses = async (): Promise<ClassOption[]> => {
  const res = await api.get<{ success: boolean; data: ClassOption[] }>(
    "/academic/student/classes"
  );
  return res.data?.data ?? [];
};

export const saveAcademicDetails = async (data:  {
    id: string | undefined;
    first_name: string;
    last_name: string;
    email?: string;
    school_name: string;
    std?: string;
    pincode?: string;
    district: string;
    state: string;
    country: string;
    contact_number: string;
}) => {
  const res = await api.post("/user/save-academic-details", data);
  return res.data;
};