import '../css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchData } from './api.js';

const body = document.querySelector('body');
console.log(body);
const searchForm = document.getElementById('search-form');
const button = document.querySelector('button');
console.log(button);

const gallery = document.querySelector('.gallery');

const loadMoreBtn = document.querySelector('.load-more');
console.log(loadMoreBtn);

let page = 1;
let searchQuery = '';
const lightbox = new SimpleLightbox('.gallery a');
searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);
loadMoreBtn.classList.add('is-hidden');

async function fetchImages() {
  try {
    const { hits, totalHits } = await fetchData(searchQuery, page);
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.classList.add('is-hidden');
    } else if (hits.length > 0 && loadMoreBtn.classList.contains('is-hidden')) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      loadMoreBtn.classList.remove('is-hidden');
    }
    return hits;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there was an error fetching the images. Please try again.'
    );
  }
}

function onSearch(event) {
  event.preventDefault();
  clearGallery();
  searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  page = 1;
  fetchImages()
    .then(renderGallery)
    .catch(error => console.log(error));
}

function onLoadMore() {
  page += 1;
  fetchImages()
    .then(renderGallery)
    .then(scrollClientRect)
    .catch(
      Notiflix.Notify(
        "We're sorry, but you've reached the end of search results."
      )
    );
}

function scrollClientRect() {
  const { height: cardHeight } = gallery.firstElementChild.scrollClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function renderGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
      <a href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
      <p class="info-item">
      <b>Likes</b> ${likes}
      </p>
      <p class="info-item">
      <b>Views</b> ${views}
      </p>
      <p class="info-item">
      <b>Comments</b> ${comments}
      </p>
      <p class="info-item">
      <b>Downloads</b> ${downloads}
      </p>
      </div>
      </div>
      `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearGallery() {
  gallery.innerHTML = '';
}
