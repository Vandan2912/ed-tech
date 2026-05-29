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

type FetchQuestionsArg = { quizId?: string | number; topicId?: string | number };

export const fetchQuizQuestions = createAsyncThunk<
  Question[],
  FetchQuestionsArg | string | number,
  { rejectValue: string }
>(
  "quiz/fetchQuizQuestions",
  async (arg, { rejectWithValue }) => {
    try {
      // Normalize the argument: support legacy `topicId` string/number too.
      const { quizId, topicId } =
        typeof arg === "object"
          ? arg
          : ({ topicId: arg } as FetchQuestionsArg);

      // Resolve the quizId: prefer explicit, otherwise fall back to the first
      // quiz returned for the topic.
      let resolvedQuizId = quizId;
      if (!resolvedQuizId && topicId) {
        const quizRes = await api.get(`/course/quiz/${topicId}`);
        const quizzes = quizRes.data;
        if (!quizzes || quizzes.length === 0) return [];
        resolvedQuizId = quizzes[0].id;
      }
      if (!resolvedQuizId) return [];

      const questionsRes = await api.get(`/course/question/${resolvedQuizId}`);
      return questionsRes.data;
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
