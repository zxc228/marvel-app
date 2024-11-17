// RecentComicsFeed.js
import React, { useState } from 'react';

const RecentComicsFeed = ({ comics, onComicSelect, onFavoriteToggle, favoriteComics }) => {
    const [filterYear, setFilterYear] = useState(''); // Состояние для хранения года фильтрации

    // Фильтруем комиксы по году, если год указан
    const filteredComics = comics.filter(comic => {
        if (!filterYear) return true; // Если год не указан, возвращаем весь список
        const releaseDate = comic.dates.find(date => date.type === 'onsaleDate')?.date; // Ищем дату выхода
        return releaseDate && new Date(releaseDate).getFullYear().toString() === filterYear; // Сравниваем год
    });

    return (
        <div>
            {/* Поле для ввода года */}
            <div className="mb-6">
                <label htmlFor="yearFilter" className="block text-lg font-bold text-red-700 mb-2">
                    Filter by Year:
                </label>
                <input
                    id="yearFilter"
                    type="text"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)} // Обновляем состояние при вводе
                    placeholder="Enter year (e.g., 2023)"
                    className="w-full p-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-white text-gray-900"
                />
            </div>

            {/* Список комиксов */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredComics.map(comic => (
                    <div
                        key={comic.id}
                        className="comic-card bg-yellow-100 border-4 border-black rounded-lg p-4 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
                    >
                        <h3 className="text-xl font-bold text-red-700 mb-2">{comic.title}</h3>
                        <img
                            src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                            alt={comic.title}
                            className="w-full h-auto rounded-lg border-2 border-gray-800 shadow-lg mb-4 cursor-pointer"
                            onClick={() => onComicSelect(comic.id)} // Открытие комикса по нажатию на изображение
                        />
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => onComicSelect(comic.id)}
                                className="text-blue-700 font-semibold hover:underline"
                            >
                                View Details
                            </button>
                            <button
                                onClick={() => onFavoriteToggle(comic)}
                                className={`mt-2 px-3 py-1 rounded-full font-semibold transition-colors duration-200 ${
                                    favoriteComics.some(fav => fav.id === comic.id)
                                        ? 'bg-red-600 text-white hover:bg-yellow-500'
                                        : 'bg-blue-600 text-white hover:bg-yellow-500'
                                }`}
                            >
                                {favoriteComics.some(fav => fav.id === comic.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentComicsFeed;