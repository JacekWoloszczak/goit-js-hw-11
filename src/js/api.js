import axios from 'axios';

const API_KEY = '4005711-2a70d06d0c91a3b95804f687e';
const URL = 'https://pixabay.com/api/';

export async function fetchData(searchQuery, page) {
  try {
    const response = await axios.get(URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there was an error fetching the images. Please try again.'
    );
  }
}
