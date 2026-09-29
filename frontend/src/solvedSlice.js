import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

// Fetch once on login — reusable everywhere in the app
export const fetchSolvedProblems = createAsyncThunk(
  'solved/fetchSolvedProblems',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/problem/problemSolvedByUser');
      return Array.isArray(data) ? data.filter(Boolean) : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data || err.message);
    }
  }
);

const solvedSlice = createSlice({
  name: 'solved',
  initialState: {
    problems: [],   // full objects [{ _id, title, difficulty, tags }]
    ids:      [],   // string IDs ["abc123", ...] for fast lookup
    total:    0,
    loading:  false,
    error:    null,
  },
  reducers: {
    // Call on logout
    clearSolved: (state) => {
      state.problems = [];
      state.ids      = [];
      state.total    = 0;
      state.error    = null;
    },
    // Call immediately after a successful submission — no need to refetch
    markSolved: (state, action) => {
      const problem = action.payload; // { _id, title, difficulty, tags }
      if (!problem || !problem._id) return;
      const id = String(problem._id);
      if (!state.ids.includes(id)) {
        state.problems.push(problem);
        state.ids.push(id);
        state.total += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolvedProblems.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchSolvedProblems.fulfilled, (state, action) => {
        state.loading  = false;
        const valid    = (Array.isArray(action.payload) ? action.payload : []).filter(p => p && p._id);
        state.problems = valid;
        state.ids      = valid.map((p) => String(p._id));
        state.total    = valid.length;
      })
      .addCase(fetchSolvedProblems.rejected, (state, action) => {
        state.loading = false;
        state.error   = typeof action.payload === 'string' ? action.payload : null;
      });
  },
});

export const { clearSolved, markSolved } = solvedSlice.actions;
export default solvedSlice.reducer;
