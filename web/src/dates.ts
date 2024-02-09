import {DateTime} from "luxon";

// Very messy, but it works for now... might need to ensure it works with other timezones as well
export function CommentTimestamp(timestamp: string): string {
    const date = DateTime.fromSQL(timestamp.split("T").join(" "), {zone: "utc"})
        .setZone("local")
        .minus({hours: 5});
    return date.toRelative() as string;
}

export function AccountJoinTimestamp(timestamp: string): string {
    return DateTime.fromISO(timestamp, {zone: "gmt"}).toFormat("MMMM d, yyyy");
}
