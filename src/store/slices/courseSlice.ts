import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export interface Topic {
  id: number;
  subject_id: number;
  title: string;
  description: string;
  difficulty: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface Subject {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  topics: Topic[];
}

interface CourseState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  subjects: [],
  loading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk<Subject[], void, { rejectValue: string }>(
  "course/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/course/subjects");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch courses");
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Subject[]>) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch courses";
      });
  },
});

export default courseSlice.reducer;
