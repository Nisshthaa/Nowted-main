import { api } from "./apiClient"


export const getRecentFolders=()=>{
    return api.get('/notes/recent')
}

export const getFoldersData=()=>{
    return api.get('/folders')
}

export const createFolder=(name:string)=>{
    return api.post('/folders',{name})
}

export const updateFolder = async (id: string, name: string) => {
  return await api.patch(`/folders/${id}`, { name });
};


export const deleteFolder = async (folderId: string) => {
  return await api.delete(`/folders/${folderId}`);
};
