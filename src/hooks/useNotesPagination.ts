import { useState, useEffect } from "react";
import { getNotes } from "../Api/notes";
import type { GetNotesParams, Note } from "../components/types";

//Fetch notes page by page and manage infinite scroll
export const useNotesPagination = (
  filters: GetNotesParams,
  refreshTrigger: boolean,
) => {
  const [notes, setNotes] = useState<Note[]>([]); 
  const [page, setPage] = useState(1); 
  const limit = 10; 

  const [loading, setLoading] = useState(false); 
  const [hasMore, setHasMore] = useState(true); 



  const fetchNotes = async (pageNumber: number, reset = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await getNotes({
        ...filters,
        page: pageNumber,
        limit,
      }); 

      const data = res.data.notes || res.data.data || [];

      setNotes((prev) => (reset ? data : [...prev, ...data])); 

      
      if (data.length < limit) {
        setHasMore(false);
      }

      setPage(pageNumber);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const initFetch = async () => {
      setNotes([]);
      setPage(1);
      setHasMore(true);

      setLoading(true);
      try {
        const res = await getNotes({
          ...filters,
          page: 1,
          limit,
        });

        const data = res.data.notes || res.data.data || [];

        setNotes(data);

        if (data.length < limit) {
          setHasMore(false);
        }

        setPage(1);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    initFetch();
  }, [ refreshTrigger,JSON.stringify(filters)]);

  const fetchNextPage = () => {
    if (!hasMore || loading) return; 
    fetchNotes(page + 1);
  };

  return {
    notes,
    loading,
    hasMore,
    fetchNextPage,
  };
};
