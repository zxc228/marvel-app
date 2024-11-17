import md5 from 'crypto-js/md5';

const BASE_URL = 'https://gateway.marvel.com:443/v1/public';
const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

/**
 * Helper function to generate authorization parameters: timestamp and hash.
 * @returns {Object} Authorization parameters with timestamp, public key, and hash.
 */
function getAuthParams() {
    const ts = new Date().getTime();
    const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();
    return { ts, apikey: PUBLIC_KEY, hash };
}

/**
 * Function to perform requests to the Marvel API.
 * @param {string} endpoint - API endpoint (e.g., '/comics').
 * @param {Object} [extraParams={}] - Additional query parameters.
 * @returns {Promise<any>} Result of the API request.
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

// Function to fetch a list of recent comics
export const fetchRecentComics = async (limit = 10) => {
    try {
        // Generate a random offset for randomized results
        const randomOffset = Math.floor(Math.random() * 1000); // Specify the maximum offset

        const response = await makeApiRequest('/comics', {
            orderBy: '-modified',
            limit,
            offset: randomOffset,
        });

        if (!response || !Array.isArray(response)) {
            console.error("Invalid response format:", response);
            return [];
        }

        // Shuffle the results to randomize their order
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