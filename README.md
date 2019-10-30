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

GET /songs/:songid
- Returns an object containing the information relevant to the specified song ID
    - Playlists that include the song
    - Tracks related to the song
    - Likes associated with the song
    - Reposts associated with the song

POST /songs
- Inserts a new song into the database

POST /likes/:userid_:songid
- Creates a new like entry from a specific user for the specified song ID

DELETE /likes/:userid_:songid
- Removes the like entry for the specified song ID at the specified user ID

POST /reposts/:userid_:songid
- Creates a new repost entry from a specific user for the specified song ID

DELETE /reposts/:userid_:songid
- Removes the repost entry for the specified song ID at the specified user ID

PUT /songs/:songid
- Updates the song specified at the song ID

DELETE /songs/:songid
- Deletes the song associated with the specified song ID

## Related Projects

  - https://github.com/AirCloudy/harrison-proxy
  - Other?

