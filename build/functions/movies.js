'use strict';

var _require = require('../consts'),
    MOVIEDB_API_KEY = _require.MOVIEDB_API_KEY,
    MOVIEDB_HOST = _require.MOVIEDB_HOST,
    MOVIEDB_LANG = _require.MOVIEDB_LANG;

var _require2 = require('./https-callout'),
    fetchData = _require2.fetchData;

var getRandomMovie = async function getRandomMovie() {
  var randomPage = Math.floor(Math.random() * 80) + 1;
  var path = '/3/discover/movie?api_key=' + MOVIEDB_API_KEY + '&language=' + MOVIEDB_LANG + '&sort_by=original_title.asc' + '&include_adult=false' + 'include_video=false' + '&page=' + randomPage + '&vote_count.gte=1500' + '&with_original_language=en';
  var options = {
    host: MOVIEDB_HOST,
    path: path,
    method: 'GET'
  };

  try {
    return await fetchData(options);
  } catch (error) {
    return error;
  }
};

var getMovieTagline = async function getMovieTagline(movieId) {
  var path = '/3/movie/' + movieId + '?api_key=' + MOVIEDB_API_KEY + '&language=' + MOVIEDB_LANG;
  var options = {
    host: MOVIEDB_HOST,
    path: path,
    method: 'GET'
  };

  try {
    return await fetchData(options);
  } catch (error) {
    return error;
  }
};

var getMovieKeywords = async function getMovieKeywords(movieId) {
  var path = '/3/movie/' + movieId + '/keywords?api_key=' + MOVIEDB_API_KEY;
  var options = {
    host: MOVIEDB_HOST,
    path: path,
    method: 'GET'
  };

  try {
    return await fetchData(options);
  } catch (error) {
    return error;
  }
};

var getMovieCredits = async function getMovieCredits(movieId) {
  var path = '/3/movie/' + movieId + '/credits?api_key=' + MOVIEDB_API_KEY;
  var options = {
    host: MOVIEDB_HOST,
    path: path,
    method: 'GET'
  };

  try {
    return await fetchData(options);
  } catch (error) {
    return error;
  }
};

var searchForMovie = async function searchForMovie(movie, year) {
  var path = '/3/search/movie?api_key=' + MOVIEDB_API_KEY + '&language=' + MOVIEDB_LANG + '&query=' + encodeURIComponent(movie) + '&page=1' + '&include_adult=false' + '&year=' + encodeURIComponent(year);
  var options = {
    host: MOVIEDB_HOST,
    path: path,
    method: 'GET'
  };

  try {
    return await fetchData(options);
  } catch (error) {
    return error;
  }
};

module.exports = {
  getRandomMovie: getRandomMovie,
  getMovieTagline: getMovieTagline,
  getMovieKeywords: getMovieKeywords,
  getMovieCredits: getMovieCredits,
  searchForMovie: searchForMovie
};