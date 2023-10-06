import axios from 'axios';
// Define the base API URL as a global variable
const BASE_API_URL = 'http://localhost:5000/api';  // Adjust as needed

// Define a function to fetch data from an endpoint
function fetchData(endpoint) {
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
