# Security Specification: Myselfmk Appstore

## 1. Data Invariants
- **Public Visibility**: Anyone (authenticated or not) can read the catalog of applications (`/apps/{appId}`).
- **Administrative Control**: Only verified administrators whose UID exists in `/admins/{adminUid}` can perform full Create, Update (non-reviews), and Delete operations on `/apps/{appId}`.
- **Strict Schema Enforcement**: Admin updates must ensure correct field types, and preserve immortal fields like `id` and `releaseDate`.
- **Public Review Submission**: Unauthenticated or general users can ONLY update an app's `reviews` and `rating` fields.
- **Review Integrity Guard**: When a public user submits a review, the update is strictly validated:
  - Only `reviews` and `rating` can change (`affectedKeys().hasOnly(['reviews', 'rating'])`).
  - The review list size must grow by exactly one (`incoming().reviews.size() == existing().reviews.size() + 1`).
  - All existing reviews must remain completely unmodified (`incoming().reviews.hasAll(existing().reviews)`).
  - The rating must be a valid number between 1.0 and 5.0.

---

## 2. The "Dirty Dozen" Payloads (Exploit Attempts)

### Exploit 1: Anonymous Create App (Bypassing Admin Verification)
Attempt by an unauthenticated user to register a malicious app.
```json
{
  "id": "malicious-app",
  "name": "Steal Credentials Pro",
  "packageName": "com.steal.credentials",
  "category": "Tools",
  "downloads": 0,
  "rating": 5.0,
  "reviews": []
}
```
*Expected Result: PERMISSION_DENIED*

### Exploit 2: Admin Spoofing (Writing to Admin Collection)
An unauthenticated or standard user attempts to register their own UID in `/admins` to escalate privileges.
```json
{
  "email": "attacker@domain.com"
}
```
*Expected Result: PERMISSION_DENIED*

### Exploit 3: General User Full App Update (Hijacking Metadata)
A regular user attempts to edit the `downloadUrl` of an existing app to point to a phishing APK.
```json
{
  "name": "Taskly Pro: Kanban & Focus",
  "packageName": "com.myselfmk.tasklypro",
  "downloadUrl": "https://phishing-site.com/malicious.apk",
  "rating": 4.8,
  "reviews": []
}
```
*Expected Result: PERMISSION_DENIED*

### Exploit 4: Review Injection with Shadow Fields (Ghost Write)
A user attempts to add a review, but secretly modifies the `packageName` or `developer` of the app.
```json
{
  "packageName": "com.hacked.app",
  "developer": "Evil Corporation",
  "rating": 4.5,
  "reviews": [
    {
      "id": "rev-1234",
      "authorName": "Scammer",
      "rating": 5,
      "comment": "Nice app!",
      "date": "2026-07-16"
    }
  ]
}
```
*Expected Result: PERMISSION_DENIED (Violates `affectedKeys().hasOnly(['reviews', 'rating'])`)*

### Exploit 5: Deleting Reviews of Competitor
A user attempts to submit a review but trims or removes existing historical reviews.
```json
{
  "rating": 4.0,
  "reviews": [
    {
      "id": "rev-new",
      "authorName": "Pruner",
      "rating": 4,
      "comment": "New review!",
      "date": "2026-07-16"
    }
  ]
}
```
*Expected Result: PERMISSION_DENIED (Fails `incoming().reviews.hasAll(existing().reviews)`)*

### Exploit 6: Mass Review Spam (Multi-Review Hijack)
A user attempts to inject 50 spam reviews simultaneously in a single transaction.
```json
{
  "rating": 1.0,
  "reviews": [
    {"id": "spam1", "authorName": "Bot", "rating": 1, "comment": "Spam", "date": "2026-07-16"},
    {"id": "spam2", "authorName": "Bot", "rating": 1, "comment": "Spam", "date": "2026-07-16"}
  ]
}
```
*Expected Result: PERMISSION_DENIED (Reviews count delta must be exactly 1)*

### Exploit 7: Out-of-Bounds Ratings (Denial of Wallet / Rating Poisoning)
A user attempts to set an app's rating to `99.9` or `-5.0`.
```json
{
  "rating": 99.9,
  "reviews": [
    {
      "id": "rev-valid",
      "authorName": "Legit",
      "rating": 5,
      "comment": "Valid review",
      "date": "2026-07-16"
    }
  ]
}
```
*Expected Result: PERMISSION_DENIED*

### Exploit 8: Malformed Review Objects (Schema Pollution)
A user submits a review where the `rating` is a string instead of a number, or fields are missing.
```json
{
  "rating": 4.5,
  "reviews": [
    {
      "id": "rev-broken",
      "authorName": "Hacker",
      "rating": "FIVE_STARS",
      "comment": 12345
    }
  ]
}
```
*Expected Result: PERMISSION_DENIED*

### Exploit 9: Application Delete Attempt by Non-Admin
A standard user tries to issue a delete command to completely clear the app database.
```json
{}
```
*Expected Result: PERMISSION_DENIED*

### Exploit 10: ID Poisoning (Malicious App ID)
An admin (or rogue user) attempts to create an app with a 50KB junk-character ID string to exhaust resources.
```json
{
  "id": "a-very-long-id-constructed-to-cause-denial-of-wallet-with-large-payload-size-beyond-allowed-bounds-..."
}
```
*Expected Result: PERMISSION_DENIED*

### Exploit 11: Immortal Field Alteration (Changing Original Release Date)
An admin attempts to alter the `releaseDate` of an existing application.
```json
{
  "releaseDate": "2020-01-01"
}
```
*Expected Result: PERMISSION_DENIED*

### Exploit 12: Invalid Package Name Pattern
An admin attempts to register a package name with invalid format.
```json
{
  "packageName": "invalid_package_format_without_dots"
}
```
*Expected Result: PERMISSION_DENIED*

---

## 3. Test Runner Structure
The corresponding testing checks are integrated and deployed securely via direct unit tests of the compiled security rules on the provisioned Firebase emulator.
