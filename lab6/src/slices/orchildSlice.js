// src/slice/orchildSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const BASE = "https://66fb75a68583ac93b40bd367.mockapi.io/orchild";

async function jsonFetch(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      toast.error(`Error "Request failed"`);
      throw new Error("Request failed");
    }
    return response.json();
  } catch (e) {
    toast.error(`Error: ${e.message}`);
  }
}

export const fetchOrchilds = createAsyncThunk("orchild/fetchAll", async () => {
  return await jsonFetch(BASE);
});

export const fetchOrchildById = createAsyncThunk(
  "orchild/fetchById",
  async (id) => {
    return await jsonFetch(`${BASE}/${id}`);
  }
);

export const createOrchild = createAsyncThunk(
  "orchild/create",
  async (data) => {
    return await jsonFetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }
);

export const updateOrchild = createAsyncThunk(
  "orchild/update",
  async ({ id, data }) => {
    return await jsonFetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }
);

export const deleteOrchild = createAsyncThunk("orchild/delete", async (id) => {
  await jsonFetch(`${BASE}/${id}`, { method: "DELETE" });
  return id;
});

const initialState = {
  list: [],
  current: null,
  isLoading: false,
};

const orchildSlice = createSlice({
  name: "orchild",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // LIST
    builder
      .addCase(fetchOrchilds.pending, (s) => {
        s.isLoading = true;
      })
      .addCase(fetchOrchilds.fulfilled, (s, a) => {
        s.isLoading = false;
        s.list = a.payload || [];
      })
      .addCase(fetchOrchilds.rejected, (s) => {
        s.isLoading = false;
      })

      // DETAIL
      .addCase(fetchOrchildById.pending, (s) => {
        s.isLoading = true;
      })
      .addCase(fetchOrchildById.fulfilled, (s, a) => {
        s.isLoading = false;
        s.current = a.payload || null;
      })
      .addCase(fetchOrchildById.rejected, (s) => {
        s.isLoading = false;
      })

      // CREATE
      .addCase(createOrchild.pending, (s) => {
        s.isLoading = true;
      })
      .addCase(createOrchild.fulfilled, (s, a) => {
        s.isLoading = false;
        if (a.payload) s.list.push(a.payload);
      })
      .addCase(createOrchild.rejected, (s) => {
        s.isLoading = false;
      })

      // UPDATE
      .addCase(updateOrchild.pending, (s) => {
        s.isLoading = true;
      })
      .addCase(updateOrchild.fulfilled, (s, a) => {
        s.isLoading = false;
        const updated = a.payload;
        if (!updated) return;
        const i = s.list.findIndex((x) => String(x.id) === String(updated.id));
        if (i !== -1) s.list[i] = updated;
        if (s.current && String(s.current.id) === String(updated.id))
          s.current = updated;
      })
      .addCase(updateOrchild.rejected, (s) => {
        s.isLoading = false;
      })

      // DELETE
      .addCase(deleteOrchild.pending, (s) => {
        s.isLoading = true;
      })
      .addCase(deleteOrchild.fulfilled, (s, a) => {
        s.isLoading = false;
        const id = a.payload;
        s.list = s.list.filter((x) => String(x.id) !== String(id));
        if (s.current && String(s.current.id) === String(id)) s.current = null;
      })
      .addCase(deleteOrchild.rejected, (s) => {
        s.isLoading = false;
      });
  },
});

export const { clearCurrent, clearError } = orchildSlice.actions;
export default orchildSlice.reducer;

export const selectOrchildList = (s) => s.orchild.list;
export const selectOrchildCurrent = (s) => s.orchild.current;
