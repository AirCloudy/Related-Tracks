# Related-Tracks Service

Information related to the current song being played. Specific information included is as follows:
    - Tracks related to the current song
    - Playlists that include the current song
    - Number of likes and users that liked the current song
    - Reposts of the current song and users that reposted

## Table of Contents

1. [Usage] (#usage)
1. [API Documentation](#api-documentation)
1. [Related Projects](#related-projects)

## Usage

** Instructions on running the service will go here **

## API Documentation

### GET /songs/:songid
- Gets information regarding the requested song.

#### Parameter

| Name             | Type          | Description                                                            |
| ---------------- |:-------------:| :----------------------------------------------------------------------|
| `songId`         | `int`         | Integer representing the current song.                                 |

#### Reponse

| Name             | Type          | Description                                                            |
| ---------------- |:-------------:| :----------------------------------------------------------------------|
| `relSongInfo`    | `array`       | Array of objects each containing information about a                   |
|                  |               | related song. Object is formatted as follows:                          |
|                  |               | { 'songName': string, 'playCount': int, 'likesCount': int,             |
|                  |               |   'repostsCount': int, 'commentsCount': int, 'songAvatarUrl': string } |
| `relArtistInfo`  | `array`       | Array of objects each containing information about the                 |
|                  |               | related song's artist. Object is formatted as follows:                 |
|                  |               | { 'artistName': string, 'proUnlimited': boolean, 'followerCount': int, |
|                  |               |   'physLocation': string, 'artistAvatarUrl': string }                  |
| `albumInfo`      | `object`      | Object containing information about the current song's album. Object   |
|                  |               | structure is as follows:                                               |
|                  |               | { 'albumName': string, 'artistName': string, 'releaseYear': int,       |
|                  |               |   'followerCount': int, 'physLocation': string, 'proUnlimited': string,|
|                  |               |   'songAvatarUrl': string, 'albumAvatarUrl': string }                  |
| `likesInfo`      | `array`       | Array of objects each containing information about the likes           |
|                  |               | associated with the current song. Object is formatted as follows:      |
|                  |               | { 'userName': string, 'followerCount': int, 'userAvatarUrl': string }  |
| `repostInfo`     | `array`       | Array of objects each containing information about the reposts         |
|                  |               | associated with the current song. Object is formatted as follows:      |
|                  |               | { 'userName': string, 'followerCount': int, 'userAvatarUrl': string }  |

### POST /songs
- Inserts a new song into the database

#### Parameters

| Name             | Type          | Description                                                            |
| ---------------- |:-------------:| :----------------------------------------------------------------------|
| `songName`       | `string`      | *Required* Name of the song to be added.                               |
| `artistName`     | `string`      | *Required* Name of the artist of the song.                             |
| `albumName`      | `string`      | *Required* Name of the album the song appears on.                      |
| `genre`          | `string`      | *Required* Name of the genre the song belongs to.                      |
| `songAvatarUrl`  | `string`      | URL of the image for the song.                                         |
| `artistAvatarUrl`| `string`      | URL of the image for the artist of the song.                           |
| `albumAvatarUrl` | `string`      | URL of the image for the album of the song.                            |

### POST /likes?song=songid&user=userid
- Creates a new like entry from a specific user for the specified song ID

#### Parameters

| Name             | Type          | Description                                                            |
| ---------------- |:-------------:| :----------------------------------------------------------------------|
| `songId`         | `int`         | *Required* Id of the song that was liked.                              |
| `userId`         | `int`         | *Required* Id of the user that liked the song.                         |

### DELETE /likes?song=songid&user=userid
- Removes the like entry for the specified song ID at the specified user ID

| Name             | Type          | Description                                                            |
| ---------------- |:-------------:| :----------------------------------------------------------------------|
| `songId`         | `int`         | *Required* Id of the song that was liked.                              |
| `userId`         | `int`         | *Required* Id of the user that liked the song.                         |

### POST /reposts?song=songid&user=userid
- Creates a new repost entry from a specific user for the specified song ID

| Name             | Type          | Description                                                            |
| ---------------- |:-------------:| :----------------------------------------------------------------------|
| `songId`         | `int`         | *Required* Id of the song that was reposted.                           |
| `userId`         | `int`         | *Required* Id of the user that reposted the song.                      |

### DELETE /reposts?song=songid&user=userid
- Removes the repost entry for the specified song ID at the specified user ID

| Name             | Type          | Description                                                            |
| ---------------- |:-------------:| :----------------------------------------------------------------------|
| `songId`         | `int`         | *Required* Id of the song that was reposted.                           |
| `userId`         | `int`         | *Required* Id of the user that reposted the song.                      |

PUT /songs/:songid
- Updates the song specified at the song ID

DELETE /songs/:songid
- Deletes the song associated with the specified song ID

## Related Projects

  - https://github.com/AirCloudy/harrison-proxy
  - Other?

