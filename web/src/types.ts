export interface SongMetadata {
    id: string;
    name: string;
    artist: string;
    artist_id: string;
    album: string;
    album_id: string;
    albumArtUrl: string;
    releaseDate: string;
    popularity: string;
    previewUrl: string;
    availableMarkets: string[];
}

export interface Song {
    id: string;
    title: string;
    artist: string;
}

export interface Review {
    comment_text: string;
    name: string;
    time: string;
}

export interface UserProfileSongs {
    pinnedSongs: SongMetadata[];
    favoritedSongs: SongMetadata[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    bio: string;
    join_date: string;
    role: string | undefined; // as of right now, this is undefined (no admins)
}
