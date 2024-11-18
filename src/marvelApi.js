import md5 from 'crypto-js/md5';

const BASE_URL = 'https://gateway.marvel.com:443/v1/public';
const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

/**
 * Generates authentication parameters for Marvel API requests.
 * @returns {Object} An object containing the timestamp, public API key, and hash.
 */
function getAuthParams() {
    const ts = new Date().getTime();
    const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();
    return { ts, apikey: PUBLIC_KEY, hash };
}

/**
 * Makes an API request to the specified endpoint with the given parameters.
 * @param {string} endpoint - The API endpoint to request.
 * @param {Object} extraParams - Additional parameters for the request.
 * @returns {Promise<Array|null>} The results of the API request or null if an error occurs.
 */
async function makeApiRequest(endpoint, extraParams = {}) {
    const { ts, apikey, hash } = getAuthParams();
    const params = new URLSearchParams({ ts, apikey, hash, ...extraParams });
    const url = `${BASE_URL}${endpoint}?${params.toString()}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data.results;
    } catch (error) {
        console.error(`Error while making request to ${endpoint}:`, error);
        return null;
    }
}

/**
 * Fetches a list of recent comics from the Marvel API.
 * @param {number} limit - The number of comics to fetch.
 * @returns {Promise<Array>} A shuffled array of recent comics.
 */
export const fetchRecentComics = async (limit = 10) => {
    try {
        const randomOffset = Math.floor(Math.random() * 1000);
        const response = await makeApiRequest('/comics', {
            orderBy: '-modified',
            limit,
            offset: randomOffset,
        });
        if (!response || !Array.isArray(response)) {
            console.error("Invalid response format:", response);
            return [];
        }
        return response.sort(() => Math.random() - 0.5);
    } catch (error) {
        console.error('Error in fetchRecentComics:', error);
        return [];
    }
};

// Function to fetch detailed information about a comic by its ID
export const fetchComicById = async (comicId) => {
    const results = await makeApiRequest(`/comics/${comicId}`);
    return results.length ? results[0] : null; // Return the first result
};


// Function to fetch characters associated with a specific comic
export const fetchComicCharacters = async (comicId) => {
    try {
        const response = await makeApiRequest(`/comics/${comicId}/characters`);
        if (!response || !Array.isArray(response)) {
            console.error('Invalid response format for characters:', response);
            return [];
        }
        return response;
    } catch (error) {
        console.error(`Error fetching characters for comic ID ${comicId}:`, error);
        return [];
    }
};
