import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  startedAt: null,
  finishedAt: null,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    addQuestion: {
      prepare: (text) => ({
        payload: {
          id: nanoid(),
          text,
          options: ["", ""],
          correctIndex: 0,
          selectedIndex: null,
        },
      }),
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
    },
    updateQuestionText(state, action) {
      const { id, text } = action.payload;
      const q = state.items.find((x) => x.id === id);
      if (q) q.text = text;
    },

    removeQuestion(state, action) {
      state.items = state.items.filter((q) => q.id !== action.payload);
    },

    setCorrectIndex(state, action) {
      const { id, index } = action.payload;
      const q = state.items.find((x) => x.id === id);
      if (q) q.correctIndex = index;
    },
    updateOption(state, action) {
      const { id, index, value } = action.payload;
      const q = state.items.find((x) => x.id === id);
      if (q && q.options[index] !== undefined) q.options[index] = value;
    },
    removeOption(state, action) {
      const { id, index } = action.payload;
      const q = state.items.find((x) => x.id === id);
      if (!q || q.options.length <= 2) return;
      q.options.splice(index, 1);
      // Nếu xóa correct option thì set nó về 0
      if (q.correctIndex >= index) q.correctIndex = 0;
    },
    addOption(state, action) {
      const { id } = action.payload;
      const q = state.items.find((x) => x.id === id);
      if (q) q.options.push("");
    },

    startQuiz(state) {
      state.items.forEach((q) => (q.selectedIndex = null));
      state.startedAt = Date.now();
      state.finishedAt = null;
    },

    selectAnswer(state, action) {
      const { id, selectedIndex } = action.payload;
      const q = state.items.find((x) => x.id === id);
      if (q) q.selectedIndex = selectedIndex;
    },
    finishQuiz(state) {
      state.finishedAt = Date.now();
    },
    resetAll() {
      return initialState;
    },
  },
});

export const {
  addQuestion,
  removeQuestion,
  updateQuestionText,
  addOption,
  updateOption,
  removeOption,
  setCorrectIndex,
  startQuiz,
  selectAnswer,
  finishQuiz,
  resetAll,
} = quizSlice.actions;

export default quizSlice.reducer;

export const selectQuestions = (s) => s.quiz.items;

export const selectScore = (s) =>
  s.quiz.items.reduce(
    (acc, q) => acc + (q.selectedIndex === q.correctIndex ? 1 : 0),
    0
  );
