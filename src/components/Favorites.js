import React from 'react';
import ComicCard from './ComicCard';

const Favorites = ({ favoriteComics, onComicSelect, onFavoriteToggle, clearFavorites }) => {
    // Сортируем комиксы по алфавиту
    const sortedFavorites = [...favoriteComics].sort((a, b) =>
        a.title.localeCompare(b.title)
    );

    return (
        <div>
            <h2 className="text-3xl font-bold text-yellow-500 mb-4 underline decoration-red-600 decoration-4">Favorites</h2>

            {/* Кнопка очистки избранного */}
            {favoriteComics.length > 0 && (
                <button
                    onClick={clearFavorites}
                    className="px-4 py-2 mb-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 shadow-md"
                >
                    Clear All Favorites
                </button>
            )}

            {favoriteComics.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortedFavorites.map((comic) => (
                        <ComicCard
                            key={comic.id}
                            comic={comic}
                            onSelect={onComicSelect}
                            onFavoriteToggle={onFavoriteToggle}
                            isFavorite={true}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-lg text-red-600">No favorites added yet.</p>
            )}
        </div>
    );
};

export default Favorites;