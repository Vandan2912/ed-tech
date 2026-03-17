import { api } from "@/lib/api";

export const saveAcademicDetails = async (data:  {
    id: string | undefined;
    first_name: string;
    last_name: string;
    school_name: string;
    district: string;
    state: string;
    country: string;
    contact_number: string;
}) => {
  const res = await api.post("/user/save-academic-details", data);
  return res.data;
};