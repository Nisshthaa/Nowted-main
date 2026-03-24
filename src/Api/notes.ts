import { api } from "./Axios"


export const getNotes=(folderId:string)=>{
    return api.get(`/notes?folderId=${folderId}`)
}

export const getNotesData=(NotesId:string)=>{
    return api.get(`/notes/${NotesId}`)
}

