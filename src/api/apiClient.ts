import axios from "axios"

export const api=axios.create({
    baseURL:"https://nowted-server.remotestate.com"
})
