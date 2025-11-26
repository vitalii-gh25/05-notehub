import axios from "axios";
import type { Note } from "../types/note";

const API_BASE = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!TOKEN) {
  console.warn("VITE_NOTEHUB_TOKEN is not set. Запросы будут неавторизованы.");
}

export const api = axios.create({
  baseURL: API_BASE,
  headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : undefined,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.warn(
      "[api error]",
      err?.response?.status,
      err?.config?.url,
      err?.response?.data
    );
    return Promise.reject(err);
  }
);

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
  sortBy?: "created" | "updated";
  signal?: AbortSignal;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
  tag,
  sortBy,
  signal,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search, tag, sortBy },
    signal,
  });
  return data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
