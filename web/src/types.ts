import {RowDataPacket} from "mysql2";

export interface SongMetadata {
    id: string;
    name: string;
    artist: string;
    artist_id: string;
    album: string;
    album_id: string;
    explicit: boolean;
    albumArtUrl: string;
    releaseDate: string;
    popularity: string;
    previewUrl: string;
    availableMarkets: string[];
    avg_rating: number | null;
    num_reviews: number | null;
    user_rating: number | null;
    pinned: boolean | null;
    favorited: boolean | null;
}

export interface Song {
    id: string;
    title: string;
    artist: string;
}

export interface Review {
    comment_id: string;
    user_id: string;
    comment_text: string;
    name: string;
    time: string;
    num_likes: number;
}

export interface UserProfileSongs {
    pinnedSongs: SongMetadata[];
    favoritedSongs: SongMetadata[];
    showFavoriteSongs: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    bio: string;
    join_date: string;
    role?: string; // as of right now, this is undefined (no artists, etc.)
    show_favorite_songs: boolean;
    show_reviews: boolean;
    show_explicit: boolean;
    isAdmin: boolean;
}

export interface ProfileStatistics {
    total_comments: number;
    total_favorites: number;
    avg_rating: number;
    totalFollowers?: number;
    totalFollowing?: number;
}

export interface SongReviewRow extends RowDataPacket {
    id: string;
    num_reviews: number;
    title: string;
    artist: string;
}

export interface UserTopReviews extends RowDataPacket {
    user_id: string;
    comment_id: string;
    spotify_work_id: string;
    comment_text: string;
    time: string;
    num_likes: number;
}

export interface ProfileTopReviews {
    spotify_work_id: string;
    title: string;
    artist: string;
    album: string;
    image: string;
    user_id: string;
    comment_id: string;
    comment_text: string;
    time: string;
    num_likes: number;
}
