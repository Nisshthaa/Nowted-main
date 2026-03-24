import { api } from "./Axios"


export const getRecentFolders=()=>{
    return api.get('/notes/recent')
}

export const getFoldersData=()=>{
    return api.get('/folders')
}

export const createFolder=(name:string)=>{
    return api.post('/folders',{name})
}