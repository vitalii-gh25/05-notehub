import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { FetchNotesResponse } from "../../services/noteService";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 500);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setCurrentPage(1);
  };

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: ({ signal }) =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search: debouncedSearch,
        signal,
      }),
    staleTime: 1000 * 30,
  });

  if (isLoading) return <p className={css.message}>Loading notes...</p>;
  if (isError || !data)
    return <p className={css.message}>Error loading notes.</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />
        {data.totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={data.totalPages}
            setPage={setCurrentPage}
          />
        )}
        <button onClick={() => setIsFormOpen(true)} className={css.button}>
          Create Note
        </button>
      </header>

      <main className={css.main}>
        {isFormOpen && (
          <Modal onClose={() => setIsFormOpen(false)}>
            <NoteForm onClose={() => setIsFormOpen(false)} />
          </Modal>
        )}

        {data.notes.length > 0 && <NoteList notes={data.notes} />}
      </main>
    </div>
  );
};

export default App;
