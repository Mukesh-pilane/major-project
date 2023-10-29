import axios from 'axios';
// Define the base API URL as a global variable
const BASE_API_URL = 'https://joblisterapi.onrender.com/api'
// 'https://joblisterapi.onrender.com/api';  // Adjust as needed

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
export function rankResume(file, jobDescription) {
  // Construct the full API URL
  const apiUrl = `${BASE_API_URL}/ranker`;
  console.log(file.length,"in");
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);
  
  

  return axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(response => {
      // Handle the successful response
      return response.data;
    })
    .catch(error => {
      // Handle any errors that occur during the request
      // throw error;
    });
}

export function getResume(id: string){
  const apiUrl = `${BASE_API_URL}/getResume`;
  return axios.post(apiUrl, {
    id
  }).then(response => {
    // Handle the successful response
    return response.data;
  })
  .catch(error => {
    // Handle any errors that occur during the request
    throw error;
  });
}

export function fetchRecommendation(keyword) { 
  // Construct the full API URL
  const apiUrl = `${BASE_API_URL}/recommend?keyword=${keyword}`;

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