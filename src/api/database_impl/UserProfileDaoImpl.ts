import UserProfile from "@/src/shared/user_profile";
import UserProfileDao from "../database/UserProfileDao";
import { getModule } from "../module";

class SQLiteUserProfileDao implements UserProfileDao {
  constructor() {}

  

  async insertUserProfile(profile: UserProfile): Promise<boolean> {
    const stmt = getModule().database.prepare(
      "INSERT INTO user_profiles (user_uid, name, account_creation_date, adress, country, city) VALUES (?, ?, ?,  ?, ?, ?)"
    );
    const info = stmt.run(
      profile.user_uid,
      profile.name,
      profile.account_creation_date,
      profile.address,
      profile.country,
      profile.city
    );
    return info.changes > 0;
  }

  async updateUserProfile(profile: UserProfile): Promise<boolean> {
    const stmt = getModule().database.prepare(
      "UPDATE user_profiles SET name = ?, account_creation_date = ?, adress = ? , country = ?, city = ? WHERE user_uid = ?"
    );
    const info = stmt.run(
      profile.name,
      profile.account_creation_date,
      profile.address,
      profile.country,
      profile.city,
      profile.user_uid
    );
    return info.changes > 0;
  }

  async deleteUserProfileByUid(uuid: string): Promise<boolean> {
    const stmt = getModule().database.prepare(
      "DELETE FROM user_profiles WHERE user_uid = ?"
    );
    const info = stmt.run(uuid);
    return info.changes > 0;
  }

  async getUserProfileByUid(uuid: string): Promise<UserProfile | null> {
    const stmt = getModule().database.prepare(
      "SELECT * FROM user_profiles WHERE user_uid = ?"
    );
    const result = stmt.get(uuid);
    return result ? (result as UserProfile) : null;
  }
}

export { SQLiteUserProfileDao };
