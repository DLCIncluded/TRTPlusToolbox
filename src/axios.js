import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useUserStore } from '@/stores/user'

const toast = useToast();

const apiUrl = import.meta.env.VITE_API_URL;

//setup base axios instance, with api url
const axiosInstance = axios.create({
	baseURL: apiUrl
});

axiosInstance.interceptors.request.use(config => {
	// Get token from localStorage (auth store saves it as 'auth_token')
	const token = localStorage.getItem("auth_token");
	if (token) {
		config.headers["Authorization"] = `Bearer ${token}`;
		console.log('Added auth header:', config.headers["Authorization"]);
	} else {
		console.log('No auth token found in localStorage');
	}
	return config;
});


axiosInstance.interceptors.response.use(function (response) {
	console.log(response.data)
	if(response.data['message']){
		// toast.success(response.data['message'])
	}
    return response;
}, function (error) {

	console.log(apiUrl)
	console.log(error.response)

	// If 401, either they tried something they're not allowed to do OR their token is expired
	if(error.response.status == 401){
		console.log(error.response)
		const store = useUserStore()
		store.logout()
		toast.error("Please Re-Login")
		// useToast().error(error['response'].data['message'])
		return;
	}
	// any other error just throw the error message, and exit
	console.log(error['response'].data['message'])
	toast.error(error['response'].data['message'])
    return error['response'];
});


export default axiosInstance;