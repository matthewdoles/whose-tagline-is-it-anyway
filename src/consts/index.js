if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

export const MOVIEDB_API_KEY = process.env.MOVIE_DB_API_KEY;
export const MOVIEDB_HOST = 'api.themoviedb.org';
export const MOVIEDB_LANG = 'en-US';
export const MOVIEDB_ERROR =
  'Sorry, an error occurred getting data from The Movie Database.';
export const PRODUCT_ID = process.env.GOOD_WORD_HUNTING_PRODUCT_ID;
export const VOICE_OPEN = "<voice name='Matthew'>";
export const VOICE_CLOSE = '</voice>';
