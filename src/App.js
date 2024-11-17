// App.js
import React, { useState, useEffect, useCallback } from 'react';
import RecentComicsFeed from './components/RecentComicsFeed';
import ComicDetail from './components/ComicDetail';
import Favorites from './components/Favorites';
import { fetchRecentComics } from './marvelApi';

function App() {
    const [selectedComicId, setSelectedComicId] = useState(null);
    const [favoriteComics, setFavoriteComics] = useState([]);
    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load favorites from localStorage
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavoriteComics(storedFavorites);
    }, []);

    // Toggle favorite comics
    const toggleFavorite = (comic) => {
        const isFavorite = favoriteComics.some(favComic => favComic.id === comic.id);
        const updatedFavorites = isFavorite
            ? favoriteComics.filter(favComic => favComic.id !== comic.id)
            : [...favoriteComics, comic];

        setFavoriteComics(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    // Load comics
    const loadComics = useCallback(async () => {
        if (loading) return;
        setLoading(true);
    
        try {
            const newComics = await fetchRecentComics(10); // Fetch 10 random comics
            const uniqueFilteredComics = newComics.filter(newComic => {
                const isUnique = !comics.some(existingComic => existingComic.id === newComic.id);
                const hasThumbnail = newComic.thumbnail && newComic.thumbnail.path && newComic.thumbnail.extension;
                return isUnique && hasThumbnail;
            });
    
            if (uniqueFilteredComics.length === 0) {
                console.log('No more unique comics to load');
                return; // Прекращаем загрузку, если нечего добавлять
            }
    
            setComics(prevComics => [...prevComics, ...uniqueFilteredComics]);
        } catch (error) {
            console.error('Error loading comics:', error);
        } finally {
            setLoading(false);
        }
    }, [loading, comics]);

        // Очистка всех избранных комиксов
        const clearFavorites = () => {
            if (window.confirm("Are you sure you want to clear all favorites?")) {
                setFavoriteComics([]); // Очищаем состояние избранного
                localStorage.setItem('favorites', JSON.stringify([])); // Очищаем localStorage
            }
        };

    useEffect(() => {
        loadComics();
    }, [loadComics]);

    return (
        <div className="bg-gradient-to-r from-red-700 via-black to-red-700 min-h-screen text-white">
            <header className="flex justify-center py-4 bg-black shadow-lg">
                <img src="/img/marvel-logo.png" alt="Marvel Logo" className="w-48 h-auto" />
            </header>
            <main className="container mx-auto p-4">
                {!selectedComicId ? (
                    <div>
                        <Favorites
                            favoriteComics={favoriteComics}
                            onComicSelect={setSelectedComicId}
                            onFavoriteToggle={toggleFavorite}
                            clearFavorites={clearFavorites}
                        />
                        <RecentComicsFeed
                            comics={comics}
                            onComicSelect={setSelectedComicId}
                            onFavoriteToggle={toggleFavorite}
                            favoriteComics={favoriteComics}
                        />
                        {loading && (
                            <div className="flex justify-center mt-4">
                                <div className="w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                ) : (
                    <ComicDetail
                        comicId={selectedComicId}
                        onFavoriteToggle={toggleFavorite}
                        isFavorite={favoriteComics.some(comic => comic.id === selectedComicId)}
                        goBack={() => setSelectedComicId(null)}
                    />
                )}
            </main>
        </div>
    );
}

export default App;