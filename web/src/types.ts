import { SongMetadata } from "./pages/user";

export interface Profile {
    user: User;
    pinnedSongs: string[]; // array of songids
    favoritedSongs: string[]; // array of songids
    
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