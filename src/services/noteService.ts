import axios from "axios";
import type { Note } from "../types/note";

const API_BASE = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export const api = axios.create({
  baseURL: API_BASE,
  headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : undefined,
});

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
  try {
    const { data } = await api.get<FetchNotesResponse>("/notes", {
      params: { page, perPage, search, tag, sortBy },
      signal,
    });
    console.log("API fetchNotes response:", data, "page:", page);
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === "ERR_CANCELED") return { notes: [], totalPages: 0 };
      if (err.response) {
        console.error(
          "fetchNotes Axios error:",
          err.response.status,
          err.response.data
        );
      } else {
        console.error(
          "fetchNotes Axios error: no response received",
          err.message
        );
      }
    } else {
      console.error("fetchNotes unexpected error:", err);
    }
    throw err;
  }
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  console.log("API createNote response:", data);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  console.log("API deleteNote response:", data);
  return data;
};
