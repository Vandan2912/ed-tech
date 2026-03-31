import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export interface Option {
  id: number;
  option_text: string;
  is_correct: boolean;
}

export interface Question {
  id: number;
  quiz_id: number;
  question_text: string;
  question_type: string;
  order_index: number;
  created_at: string;
  options: Option[];
}

interface QuizState {
  questions: Question[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  questions: [],
  loading: false,
  error: null,
};

export const fetchQuizQuestions = createAsyncThunk<Question[], string | number, { rejectValue: string }>(
  "quiz/fetchQuizQuestions",
  async (topicId, { rejectWithValue }) => {
    try {
      const quizRes = await api.get(`/course/quiz/${topicId}`);
      const quizzes = quizRes.data;
      if (quizzes && quizzes.length > 0) {
        const quizId = quizzes[0].id;
        const questionsRes = await api.get(`/course/question/${quizId}`);
        return questionsRes.data;
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch quiz data");
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    clearQuiz: (state) => {
      state.questions = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizQuestions.fulfilled, (state, action: PayloadAction<Question[]>) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuizQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch quiz data";
      });
  },
});

export const { clearQuiz } = quizSlice.actions;

export default quizSlice.reducer;
