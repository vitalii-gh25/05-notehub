// src/services/movieService.ts
import axios from "axios";
import type { Movie } from "../types/movie";

const API_URL = "https://api.themoviedb.org/3/search/movie";
const API_KEY = import.meta.env.VITE_TMDB_TOKEN;

/**
 * Тип відповіді API визначено у цьому файлі (за вимогою рев'ю)
 */
export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(
  query: string,
  page = 1
): Promise<MoviesResponse> {
  if (!API_KEY) {
    throw new Error("TMDB API key is not defined in VITE_TMDB_TOKEN");
  }

  const response = await axios.get<MoviesResponse>(API_URL, {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
    headers: {
      accept: "application/json",
      // TMDB v3/v4 сучасно використовує Bearer токен
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return response.data;
}
