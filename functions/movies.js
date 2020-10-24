const { MOVIEDB_API_KEY, MOVIEDB_HOST, MOVIEDB_LANG } = require('../consts');
const { fetchData } = require('./https-callout');

const getRandomMovie = async () => {
  const randomPage = Math.floor(Math.random() * 70) + 1;
  const path =
    '/3/discover/movie?api_key=' +
    MOVIEDB_API_KEY +
    '&language=' +
    MOVIEDB_LANG +
    '&sort_by=original_title.asc' +
    '&include_adult=false' +
    'include_video=false' +
    '&page=' +
    randomPage +
    '&vote_count.gte=1500' +
    '&with_original_language=en';
  const options = {
    host: MOVIEDB_HOST,
    path,
    method: 'GET',
  };

  try {
    return await fetchData(options);
  } catch (error) {
    return error;
  }
};

const getMovieTagline = async (movieId) => {
  const path =
    '/3/movie/' +
    movieId +
    '?api_key=' +
    MOVIEDB_API_KEY +
    '&language=' +
    MOVIEDB_LANG;
  const options = {
    host: MOVIEDB_HOST,
    path,
    method: 'GET',
  };

  try {
    return await fetchData(options);
  } catch (error) {
    return error;
  }
};

const getMovieKeywords = async (movieId) => {
  const path = '/3/movie/' + movieId + '/keywords?api_key=' + MOVIEDB_API_KEY;
  const options = {
    host: MOVIEDB_HOST,
    path,
    method: 'GET',
  };

  try {
    return await fetchData(options);
  } catch (error) {
    return error;
  }
};

const getMovieCredits = async (movieId) => {
  const path = '/3/movie/' + movieId + '/credits?api_key=' + MOVIEDB_API_KEY;
  const options = {
    host: MOVIEDB_HOST,
    path,
    method: 'GET',
  };

  try {
    return await fetchData(options);
  } catch (error) {
    return error;
  }
};

const searchForMovie = async (movie, year) => {
  const themoviedb_path =
    '/3/search/movie?api_key=' +
    MOVIEDB_API_KEY +
    '&language=' +
    MOVIEDB_LANG +
    '&query=' +
    encodeURIComponent(movie) +
    '&page=1' +
    '&include_adult=false' +
    '&year=' +
    encodeURIComponent(year);
  const options = {
    host: MOVIEDB_HOST,
    path,
    method: 'GET',
  };

  try {
    return await fetchData(options);
  } catch (error) {
    return error;
  }
};

module.exports = {
  getRandomMovie,
  getMovieTagline,
  getMovieKeywords,
  getMovieCredits,
  searchForMovie,
};
