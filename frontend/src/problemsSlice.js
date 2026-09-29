import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

// ── Thunks ────────────────────────────────────────────────────────────────────

// Fetch all problems — called ONCE on AdminPanel mount
export const fetchAllProblems = createAsyncThunk(
  'problems/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/problem/getAllProblem');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch single problem by ID for edit form
export const fetchProblemById = createAsyncThunk(
  'problems/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get(`/problem/problemById/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create problem — optimistically adds to list on success
export const createProblem = createAsyncThunk(
  'problems/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post('/problem/create', payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update problem — replaces in list on success
export const updateProblem = createAsyncThunk(
  'problems/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.put(`/problem/update/${id}`, payload);
      return { id, updated: data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete problem — removes from list on success
export const deleteProblem = createAsyncThunk(
  'problems/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const problemsSlice = createSlice({
  name: 'problems',
  initialState: {
    list:          [],        // all problems
    selected:      null,      // problem loaded for editing
    listLoading:   false,
    actionLoading: false,     // create / update / delete in progress
    error:         null,
    fetched:       false,     // true once list has been fetched — skip re-fetch
  },
  reducers: {
    clearSelected: (state) => { state.selected = null; },
    clearError:    (state) => { state.error    = null; },
  },
  extraReducers: (builder) => {
    // ── fetchAll ──
    builder
      .addCase(fetchAllProblems.pending, (state) => {
        state.listLoading = true; state.error = null;
      })
      .addCase(fetchAllProblems.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        state.list        = payload;
        state.fetched     = true;
      })
      .addCase(fetchAllProblems.rejected, (state, { payload }) => {
        state.listLoading = false; state.error = payload;
      });

    // ── fetchById ──
    builder
      .addCase(fetchProblemById.pending, (state) => {
        state.actionLoading = true; state.error = null;
      })
      .addCase(fetchProblemById.fulfilled, (state, { payload }) => {
        state.actionLoading = false; state.selected = payload;
      })
      .addCase(fetchProblemById.rejected, (state, { payload }) => {
        state.actionLoading = false; state.error = payload;
      });

    // ── create ──
    builder
      .addCase(createProblem.pending, (state) => {
        state.actionLoading = true; state.error = null;
      })
      .addCase(createProblem.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
        // Add to list if backend returns the new problem; else re-fetch handled by component
        if (payload?._id) state.list.unshift(payload);
      })
      .addCase(createProblem.rejected, (state, { payload }) => {
        state.actionLoading = false; state.error = payload;
      });

    // ── update ──
    builder
      .addCase(updateProblem.pending, (state) => {
        state.actionLoading = true; state.error = null;
      })
      .addCase(updateProblem.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
        if (payload?.updated?._id) {
          const idx = state.list.findIndex((p) => String(p._id) === String(payload.id));
          if (idx !== -1) state.list[idx] = payload.updated;
        }
      })
      .addCase(updateProblem.rejected, (state, { payload }) => {
        state.actionLoading = false; state.error = payload;
      });

    // ── delete ──
    builder
      .addCase(deleteProblem.pending, (state) => {
        state.actionLoading = true; state.error = null;
      })
      .addCase(deleteProblem.fulfilled, (state, { payload: id }) => {
        state.actionLoading = false;
        state.list = state.list.filter((p) => String(p._id) !== String(id));
      })
      .addCase(deleteProblem.rejected, (state, { payload }) => {
        state.actionLoading = false; state.error = payload;
      });
  },
});

export const { clearSelected, clearError } = problemsSlice.actions;
export default problemsSlice.reducer;
