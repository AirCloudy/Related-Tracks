DROP DATABASE IF EXISTS aircloudy;
CREATE DATABASE aircloudy;

\c aircloudy;

CREATE TABLE artists (
  artist_id SERIAL NOT NULL,
  artist_name VARCHAR(255) NOT NULL,
  artist_avatar_url VARCHAR(255),
  phys_location VARCHAR(255),
  year_joined INT NOT NULL,
  pro_unlimited BOOLEAN DEFAULT FALSE,

  PRIMARY KEY(artist_id)
);

CREATE TABLE users (
  user_id SERIAL NOT NULL,
  username VARCHAR(255) NOT NULL,
  user_avatar_url VARCHAR(255),
  follower_count INT DEFAULT 0,

  PRIMARY KEY(user_id)
);

CREATE TABLE genres (
  genre_id SERIAL NOT NULL,
  genre_name VARCHAR(255) NOT NULL,

  PRIMARY KEY(genre_id)
);

CREATE TABLE albums (
  album_id SERIAL NOT NULL,
  album_name VARCHAR(255) NOT NULL,
  album_art_url VARCHAR(255) NOT NULL,
  year_created INT NOT NULL,
  artist_id INT NOT NULL,

  PRIMARY KEY(album_id),
  FOREIGN KEY(artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE
);

CREATE TABLE songs (
  song_id SERIAL NOT NULL,
  song_name VARCHAR(255) NOT NULL,
  year_created INT NOT NULL,
  song_art_url VARCHAR(255) NOT NULL,
  comment_count INT NOT NULL,
  play_count INT NOT NULL,
  artist_id INT NOT NULL,
  album_id INT NOT NULL,

  PRIMARY KEY(song_id),
  FOREIGN KEY(artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE,
  FOREIGN KEY(album_id) REFERENCES albums(album_id) ON DELETE CASCADE
);

CREATE TABLE playlists (
  playlist_id SERIAL NOT NULL,
  playlist_name VARCHAR(255) NOT NULL,
  playlist_art_url VARCHAR(255) NOT NULL,
  artist_id INT,
  user_id INT,

  PRIMARY KEY(playlist_id),
  FOREIGN KEY(artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE likes (
  like_id SERIAL NOT NULL,
  user_id INT,
  artist_id INT,
  song_id INT,
  playlist_id INT,

  PRIMARY KEY(like_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY(artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE,
  FOREIGN KEY(song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
  FOREIGN KEY(playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE
);

CREATE TABLE reposts (
  repost_id SERIAL NOT NULL,
  user_id INT,
  artist_id INT,
  song_id INT,
  playlist_id INT,

  PRIMARY KEY(repost_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY(artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE,
  FOREIGN KEY(song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
  FOREIGN KEY(playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE
);

CREATE TABLE song_to_genre (
  song_id INT NOT NULL,
  genre_id INT NOT NULL,

  FOREIGN KEY(song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
  FOREIGN KEY(genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE
);

CREATE TABLE song_to_playlist (
  song_id INT NOT NULL,
  playlist_id INT NOT NULL,

  FOREIGN KEY(song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
  FOREIGN KEY(playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE
);