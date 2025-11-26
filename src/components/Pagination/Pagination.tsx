import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  setPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      forcePage={page - 1}
      pageCount={totalPages}
      onPageChange={(selected) => setPage(selected.selected + 1)}
      containerClassName={css.pagination}
      pageClassName={css.page}
      activeClassName={css.active}
      previousLabel="<"
      nextLabel=">"
    />
  );
}
