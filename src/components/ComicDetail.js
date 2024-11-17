// ComicDetail.js
import React, { useEffect, useState } from 'react';
import { fetchComicById, fetchComicCharacters } from '../marvelApi'; // Импортируем новую функцию

const ComicDetail = ({ comicId, onFavoriteToggle, isFavorite, goBack }) => {
    const [comic, setComic] = useState(null);
    const [characters, setCharacters] = useState([]); // Новое состояние для персонажей

    // Fetch the comic data when the component is mounted
    useEffect(() => {
        const loadComic = async () => {
            try {
                const comicData = await fetchComicById(comicId);
                setTimeout(() => {
                    setComic(comicData); // Set comic data after a delay for a better loading effect
                }, 1000);
            } catch (error) {
                console.error('Error fetching comic:', error);
            }
        };

        const loadCharacters = async () => {
            try {
                const characterData = await fetchComicCharacters(comicId); // Запрос персонажей
                setCharacters(characterData); // Сохраняем персонажей
            } catch (error) {
                console.error('Error fetching characters:', error);
            }
        };

        loadComic();
        loadCharacters(); // Загружаем персонажей
    }, [comicId]);

    // Show loading spinner while comic data is being fetched
    if (!comic) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                <p className="text-center text-xl font-bold text-red-600 mt-4">Loading...</p>
            </div>
        );
    }

    // Helper function for rendering characters
    const renderCharacters = () => {
        if (characters.length > 0) {
            return characters.map((character) => (
                <div key={character.id} className="flex flex-col items-center">
                    <img
                        src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                        alt={character.name}
                        className="w-24 h-24 rounded-full shadow-lg"
                    />
                    <p className="text-center text-gray-800 font-medium">{character.name}</p>
                </div>
            ));
        }
        return <p className="text-gray-500">No characters available.</p>;
    };

    return (
        <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-2xl border-4 border-black">
            {/* Back Button */}
            <button
                onClick={goBack}
                className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 shadow-lg transition-transform transform hover:scale-105"
            >
                Back to Comics
            </button>

            {/* Comic Title */}
            <h2 className="text-4xl font-extrabold text-red-700 mb-4 shadow-md">
                {comic.title || 'No title available'}
            </h2>

            {/* Comic Thumbnail */}
            <img
                src={comic?.thumbnail?.path && comic?.thumbnail?.extension
                    ? `${comic.thumbnail.path}.${comic.thumbnail.extension}`
                    : '/img/placeholder.png'}
                alt={comic?.title || 'No title available'}
                className="w-80 h-auto mb-4 border-4 border-black rounded-lg shadow-xl transition-transform transform hover:scale-110"
            />

            {/* Comic Description */}
            <p className="text-lg text-gray-800 mb-4 font-medium leading-relaxed">
                {comic.description || 'No description available.'}
            </p>

            {/* Characters */}
            <div className="mt-4">
                <h3 className="text-2xl font-bold text-red-700 mb-2">Characters</h3>
                <div className="grid grid-cols-3 gap-4">{renderCharacters()}</div>
            </div>

            {/* Favorite Toggle Button */}
            <button
                onClick={() => onFavoriteToggle(comic)}
                className={`mt-4 px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md transform hover:scale-105 ${
                    isFavorite ? 'bg-red-600 hover:bg-yellow-500 text-white' : 'bg-blue-600 hover:bg-yellow-500 text-white'
                }`}
            >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
        </div>
    );
};

export default ComicDetail;