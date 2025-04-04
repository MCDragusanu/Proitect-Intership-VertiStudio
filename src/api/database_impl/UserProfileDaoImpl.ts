import UserProfile from "@/shared/user_profile";
import UserProfileDao from "../database/UserProfileDao";
import { getModule } from "../module";

class SQLiteUserProfileDao implements UserProfileDao {
    constructor() {}

    createSource(): void {
        getModule().database.exec(`CREATE TABLE IF NOT EXISTS user_profiles (
            user_uid TEXT PRIMARY KEY,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            adress TEXT NOT NULL,
            account_creation_date TEXT NOT NULL,
            country TEXT,
            city TEXT,
            FOREIGN KEY (user_uid) REFERENCES user_credentials(user_uid)
        );`);
    }

    deleteSource(): void {
        getModule().database.exec("DROP TABLE IF EXISTS user_profiles");
    }

    clearSource(): void {
        getModule().database.exec("DELETE FROM user_profiles");
    }

    checkSource(): Boolean {
        const result = getModule().database.prepare(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='user_profiles'"
        ).get();
        return result !== undefined;
    }

    async insertUserProfile(profile: UserProfile): Promise<Boolean> {
        const stmt = getModule().database.prepare(
            "INSERT INTO user_profiles (user_uid, first_name, last_name, account_creation_date, adress, country, city) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        const info = stmt.run(
            profile.user_uid,
            profile.first_name,
            profile.last_name,
            profile.adress,
            profile.account_creation_date,
            profile.country,
            profile.city
        );
        return info.changes > 0;
    }

    async updateUserProfile(profile: UserProfile): Promise<Boolean> {
        const stmt = getModule().database.prepare(
            "UPDATE user_profiles SET first_name = ?, last_name = ?, account_creation_date = ?, adress = ? , country = ?, city = ? WHERE user_uid = ?"
        );
        const info = stmt.run(
            profile.first_name,
            profile.last_name,
            profile.account_creation_date,
            profile.adress,
            profile.country,
            profile.city,
            profile.user_uid
        );
        return info.changes > 0;
    }

    async deleteUserProfileByUid(uuid: string): Promise<Boolean> {
        const stmt = getModule().database.prepare("DELETE FROM user_profiles WHERE user_uid = ?");
        const info = stmt.run(uuid);
        return info.changes > 0;
    }

    async getUserProfileByUid(uuid: string): Promise<UserProfile | null> {
        const stmt = getModule().database.prepare("SELECT * FROM user_profiles WHERE user_uid = ?");
        const result = stmt.get(uuid);
        return result ? result as UserProfile : null;
    }
}

export {SQLiteUserProfileDao}
