
import { useSearchParams } from "react-router-dom"; 

export const useURLState = () => {
  const [searchParams, setSearchParams] = useSearchParams(); 

  const folderId = searchParams.get("folder"); 
  const noteId = searchParams.get("note"); 
  const view = searchParams.get("view"); 

  const updateURL = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams); 

    Object.entries(newParams).forEach(([key, value]) => {
      
      if (value === null) {
       
        params.delete(key);
      } else {
        params.set(key, value); 
      }
    });

     if (params.toString() !== searchParams.toString()) {
    setSearchParams(params);
  }
  };

  return {
    folderId,
    noteId,
    view,
    updateURL,
  };
};
