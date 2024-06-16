import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3055/v1/api/',
    timeout: 5000,
    headers: {
        'Content-type': 'application/json',
        'x-api-key': '3c4929932f1698233a6e7bdde5317ac613c3bd1289e896174b373aba16524769a345712eeb63916bdfdf2a25f14f3c096fb88dbdcfd38d985ac59cace9716075'
    },
});

axiosClient.interceptors.response.use(
    (response) => {
        return response.data.metadata;
    },
    (error) => {
        // Handle errors
        throw error;
    },
);

export default axiosClient;