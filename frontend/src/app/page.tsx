"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart } from "lucide-react"; // Import Heart icon

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string | null;
  duration: number | null;
  liked: boolean;
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));

    const fetchSongs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/songs", {
          params: { search },
        });
        setSongs(response.data);
      } catch (err) {
        setError("Failed to load songs");
      }
    };

    const fetchLikedSongs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/songs/liked");
        setLikedSongs(response.data);
      } catch (err) {
        console.error("Failed to load liked songs");
      }
    };

    if (token) {
      fetchSongs();
      fetchLikedSongs();
    }
  }, [search, token]);

  const handleLike = async (id: number) => {
    try {
      await axios.patch(`http://localhost:3000/songs/${id}/like`);
      setSongs((prevSongs) =>
        prevSongs.map((song) => (song.id === id ? { ...song, liked: true } : song))
      );
      const response = await axios.get("http://localhost:3000/songs/liked");
      setLikedSongs(response.data);
    } catch (err) {
      console.error("Failed to like song");
    }
  };

  const handleUnlike = async (id: number) => {
    try {
      await axios.patch(`http://localhost:3000/songs/${id}/unlike`);
      setSongs((prevSongs) =>
        prevSongs.map((song) => (song.id === id ? { ...song, liked: false } : song))
      );
      const response = await axios.get("http://localhost:3000/songs/liked");
      setLikedSongs(response.data);
    } catch (err) {
      console.error("Failed to unlike song");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Spotify</h1>
          <nav>
            <Link href="/login" className="text-gray-400 hover:text-white mr-4">
              Login
            </Link>
            <Link href="/register" className="text-gray-400 hover:text-white">
              Register
            </Link>
          </nav>
        </header>
        {token ? (
          <>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search for songs..."
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-green-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <section>
              <h2 className="text-2xl font-semibold mb-4">Song List</h2>
              {error && <p className="text-red-400 mb-4">{error}</p>}
              {songs.length > 0 ? (
                <ul className="space-y-4">
                  {songs.map((song) => (
                    <li
                      key={song.id}
                      className="p-4 bg-gray-800 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="text-xl font-semibold">{song.title}</p>
                        <p className="text-gray-400">by {song.artist}</p>
                        {song.album && <p className="text-gray-500">Album: {song.album}</p>}
                        {song.duration && (
                          <p className="text-gray-500">
                            Duration: {Math.floor(song.duration / 60)}:
                            {(song.duration % 60).toString().padStart(2, "0")}
                          </p>
                        )}
                      </div>
                      <button
                        className="p-2 rounded-full bg-transparent hover:bg-gray-700 transition-colors"
                        onClick={() =>
                          song.liked ? handleUnlike(song.id) : handleLike(song.id)
                        }
                      >
                        <Heart
                          size={28}
                          className={`transition-colors ${
                            song.liked ? "fill-green-500 text-green-500" : "text-gray-400"
                          }`}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center">No songs available</p>
              )}
            </section>
            <section className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Liked Songs</h2>
              {likedSongs.length > 0 ? (
                <ul className="space-y-4">
                  {likedSongs.map((song) => (
                    <li
                      key={song.id}
                      className="p-4 bg-gray-800 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="text-xl font-semibold">{song.title}</p>
                        <p className="text-gray-400">by {song.artist}</p>
                      </div>
                      <button
                        className="p-2 rounded-full bg-transparent hover:bg-gray-700 transition-colors"
                        onClick={() => handleUnlike(song.id)}
                      >
                        <Heart size={28} className="fill-green-500 text-green-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center">No liked songs yet</p>
              )}
            </section>
          </>
        ) : (
          <div className="text-center mt-12">
            <p className="mb-4 text-gray-400">Please log in or register to view songs.</p>
            <div className="space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 bg-green-500 text-black rounded-full hover:bg-green-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-green-500 text-black rounded-full hover:bg-green-600"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
