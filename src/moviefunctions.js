const https = require('https');
const themoviedb_api_key = process.env.MOVIE_DB_API_KEY;
const themoviedb_language = 'en-US';
const themoviedb_host = 'api.themoviedb.org';

const MovieFunctions = {
  getRandomMovie: async function () {
    var random_page = Math.floor(Math.random() * 90) + 1;
    var themoviedb_path =
      '/3/discover/movie?api_key=' +
      themoviedb_api_key +
      '&language=' +
      themoviedb_language +
      '&sort_by=original_title.asc' +
      '&include_adult=false' +
      'include_video=false' +
      '&page=' +
      random_page +
      '&vote_count.gte=1500';
    +'&with_original_language=en';
    let options = {
      host: themoviedb_host,
      path: themoviedb_path,
      method: 'GET',
    };
    console.log(
      'The Movie DB API Path --> https://' + themoviedb_host + themoviedb_path
    );
    try {
      return await MovieFunctions.getData(options);
    } catch (error) {
      return error;
    }
  },
  getMovieTagline: async function (movie_id) {
    var themoviedb_search_movie_tagline_path =
      '/3/movie/' +
      movie_id +
      '?api_key=' +
      themoviedb_api_key +
      '&language=' +
      themoviedb_language;
    let options = {
      host: themoviedb_host,
      path: themoviedb_search_movie_tagline_path,
      method: 'GET',
    };
    console.log(
      'The Movie DB API Path --> https://' +
        themoviedb_host +
        themoviedb_search_movie_tagline_path
    );
    try {
      return await MovieFunctions.getData(options);
    } catch (error) {
      return error;
    }
  },
  getMovieKeywords: async function (movie_id) {
    var themoviedb_search_movie_keywords_path =
      '/3/movie/' + movie_id + '/keywords?api_key=' + themoviedb_api_key;

    let options = {
      host: themoviedb_host,
      path: themoviedb_search_movie_keywords_path,
      method: 'GET',
    };
    console.log(
      'The Movie DB API Path --> https://' +
        themoviedb_host +
        themoviedb_search_movie_keywords_path
    );
    try {
      return await MovieFunctions.getData(options);
    } catch (error) {
      return error;
    }
  },
  getMovieCredits: async function (movie_id) {
    var themoviedb_search_movie_credits_path =
      '/3/movie/' + movie_id + '/credits?api_key=' + themoviedb_api_key;

    let options = {
      host: themoviedb_host,
      path: themoviedb_search_movie_credits_path,
      method: 'GET',
    };
    console.log(
      'The Movie DB API Path --> https://' +
        themoviedb_host +
        themoviedb_search_movie_credits_path
    );
    try {
      return await MovieFunctions.getData(options);
    } catch (error) {
      return error;
    }
  },
  searchForMovie: async function (movie, year) {
    var themoviedb_path =
      '/3/search/movie?api_key=' +
      themoviedb_api_key +
      '&language=' +
      themoviedb_language +
      '&query=' +
      encodeURIComponent(movie) +
      '&page=1' +
      '&include_adult=false' +
      '&year=' +
      encodeURIComponent(year);
    let options = {
      host: themoviedb_host,
      path: themoviedb_path,
      method: 'GET',
    };
    console.log(
      'The Movie DB API Path --> https://' + themoviedb_host + themoviedb_path
    );
    try {
      return await MovieFunctions.getData(options);
    } catch (error) {
      return error;
    }
  },
  getData: function (options, postData) {
    return new Promise(function (resolve, reject) {
      var request = https.request(options, function (response) {
        if (response.statusCode < 200 || response.stausCode >= 300) {
          return reject(new Error('statusCode= ' + response.statusCode));
        }

        var body = [];
        response.on('data', function (chunk) {
          body.push(chunk);
        });

        response.on('end', function () {
          try {
            body = JSON.parse(Buffer.concat(body).toString());
          } catch (error) {
            reject(error);
          }
          resolve(body);
        });
      });
      request.on('error', function (error) {
        reject(error);
      });

      if (postData) {
        request.write(postData);
      }
      request.end();
    });
  },
};
module.exports = MovieFunctions;
