import axios from 'axios'
import https from 'https';
// import env from 'react-dotenv'
import { requestHandler, successHandler, errorHandler } from 'network/interceptors'

let baseURL = ''
  
// switch (window.location.origin) {
//     case process.env.PROD_FE_BASE_URL:
//         baseURL = process.env.PROD_BASE_URL
//         break
//     default:
//         baseURL = process.env.DEV_BASE_URL
// }

axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_DEV_BASE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-App-Type': 'listing'
    },
})

// Handle request process
axiosInstance.interceptors.request.use((request) => requestHandler(request))
// Handle response process
axiosInstance.interceptors.response.use(
    (response) => successHandler(response),
    (error) => errorHandler(error),
)
