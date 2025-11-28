import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import type { Note } from "../../types/note";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import css from "./App.module.css";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const queryClient = useQueryClient();

  const updateSearchQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    },
    900
  );

  const { data, isFetching, isError } = useQuery({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () =>
      fetchNotes({ page: currentPage, perPage: 12, search: searchQuery }),
    placeholderData: () =>
      queryClient.getQueryData(["notes", currentPage - 1, searchQuery]),
  });

  if (isFetching && !data)
    return <p className={css.message}>Loading notes...</p>;
  if (isError) return <p className={css.message}>Error loading notes.</p>;

  const notes: Note[] = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <input
          type="text"
          defaultValue={searchQuery}
          onChange={updateSearchQuery}
          placeholder="Search notes"
          className={css.input}
        />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            setPage={setCurrentPage}
            currentPage={currentPage}
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

        {notes.length > 0 ? (
          <NoteList notes={notes} />
        ) : (
          <p className={css.message}>No notes found.</p>
        )}
      </main>
    </div>
  );
}
