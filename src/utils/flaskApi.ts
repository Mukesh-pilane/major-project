import axios from 'axios';
// Define the base API URL as a global variable
const BASE_API_URL = 'http://localhost:5000/api';  // Adjust as needed

// Define a function to fetch data from an endpoint
export function fetchData(endpoint) {
  // Construct the full API URL
  const apiUrl = `${BASE_API_URL}/${endpoint}`;

  return axios.get(apiUrl)
    .then(response => {
      // Handle the successful response
      return response.data;
    })
    .catch(error => {
      // Handle any errors that occur during the request
      throw error;
    });
}

// Define a function to upload a PDF file to the Flask API
export function rankResume(file) {
  // Construct the full API URL
  const apiUrl = `${BASE_API_URL}/ranker`;

  const formData = new FormData();
  formData.append('file', file);

  return axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      // Handle the successful response
      console.log(response)
      return response.data;
    })
    .catch(error => {
      // Handle any errors that occur during the request
      throw error;
    });
}
