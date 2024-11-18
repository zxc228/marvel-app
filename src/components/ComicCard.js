// src/components/ComicCard.js
import React from 'react';

const ComicCard = ({ comic, onSelect, onFavoriteToggle, isFavorite }) => (
    <div
        onClick={() => onSelect(comic.id)}
        className="border-4 border-red-600 rounded-lg p-4 cursor-pointer transition transform hover:scale-105 bg-white shadow-lg"
    >
        <img
            src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
            alt={comic.title}
            className="w-36 h-auto mb-2 rounded-lg"
        />
        <p className="text-center font-bold text-black">{comic.title}</p>
        <button
            onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(comic);
            }}
            className={`mt-2 px-4 py-1 rounded-lg font-semibold ${
                isFavorite ? 'bg-yellow-500 text-black' : 'bg-red-600 text-white'
            } hover:bg-yellow-400`}
        >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
    </div>
);

export default ComicCard;
