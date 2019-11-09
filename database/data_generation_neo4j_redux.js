const fs = require('fs');
const faker = require('faker');
const path = require('path');

// Creating variable for the destination folder of all generated data
var dataFolder = path.join(__dirname, 'data', 'neo4j');

var MAX_ARTIST_COUNT = 100000; // # of artists to be generated
var MAX_ALBUM_COUNT = 300000; // # of albums to be generated
var MAX_SONG_COUNT = 10000000; // # of songs to be generated
var MAX_USER_COUNT = 100000; // # of users to be generated
var MAX_PLAYLIST_COUNT = 20000; // # of playlists to be generated
var MAX_GENRE_COUNT = 100; // # of genres to be generated

var joined_years_array = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]; // Pre-populating possible selections for the year a user or artist joined
var created_years_array = []; // Creating an array to store possible years that a song, playlist, or album was created

// Populating 'created_years_array' with year values starting from 1900
for (var i = 0; i < 120; i++) {
    created_years_array.push(1900 + i);
}

var artists = [];

for (var i = 0; i < MAX_ARTIST_COUNT; i++) {
    var pro = i % 2 === 0 ? true : false;
    
    var artist = {
        artist_id: i,
        artist_name: faker.internet.userName(),
        artist_avatar_url: faker.image.imageUrl(),
        artist_city: faker.address.city(),
        artist_year_joined: joined_years_array[faker.random.number({min: 0, max: 9})],
        artist_pro_unlimited: pro
    }

    artists.push(artist);
}

var albums = [];

for (var i = 0; i < MAX_ALBUM_COUNT; i++) {
    var album = {
        album_id: i,
        album_name: faker.company.catchPhrase(),
        album_year_created: created_years_array[faker.random.number({min: 0, max: 119})],
        album_art_url: faker.image.imageUrl()
    }

    albums.push(album);
}

function songDataGeneration() {
    var songHeader = 'song_id,song_name,song_year_created,song_art_url,artist_id,artist_name,artist_avatar_url,artist_city,artist_year_joined,artist_pro_unlimited,album_id,album_name,album_year_created,album_art_url'; // Creating table headers
 
    var songWriteStream = fs.createWriteStream(path.resolve(dataFolder, 'songs_data.csv')); // Establishing write stream
    
    // Defining the function which will handle writing the actual file. The function takes three parameters: 'writer' (a write stream), 'encoding'
    // (the encoding to use), and a callback function that will be run when writing has completed. 
    function writeSongFile(writer, encoding, callback) {
        writer.write(songHeader + '\n'); // Writing headers to the file
        
        var iterations = MAX_SONG_COUNT; // Number of records to add to the file
        var id = 0;
        var artist_number = 0;
        var album_number= 0;
        
        // Defining the function that will write data to the file
        function writeSongData() {
            let ok = true; // This variable indicates whether the write stream can handle more data
            
            // Starting a loop to add additional data to the file      
            do {
                iterations -= 1; // Ensures the iterations variable is decremented for each record written

                artist_number = artist_number === MAX_ARTIST_COUNT ? 0 : artist_number;
                album_number = album_number === MAX_ALBUM_COUNT ? 0 : album_number;

                var artist = artists[artist_number];
                var album = albums[album_number];

                const song_id = id;
                const song_name = faker.company.catchPhrase(); // Song Name
                const song_year_created = created_years_array[faker.random.number({min: 0, max: 119})]; // Song Year Created 
                const song_art_url = faker.image.imageUrl(); // Song Art URL
                const artist_id = artist.artist_id;
                const artist_name = artist.artist_name;
                const artist_avatar_url = artist.artist_avatar_url;
                const artist_year_joined = artist.artist_year_joined;
                const artist_city = artist.artist_city;
                const artist_pro_unlimited = artist.artist_pro_unlimited;
                const album_id = album.album_id;
                const album_name = album.album_name;
                const album_year_created = album.album_year_created;
                const album_art_url = album.album_art_url;

                id++;
                artist_number++;
                album_number++;

                const data = `${song_id},${song_name},${song_year_created},${song_art_url},${artist_id},${artist_name},${artist_avatar_url},${artist_city},${artist_year_joined},${artist_pro_unlimited},${album_id},${album_name},${album_year_created},${album_art_url}\n`; // Creating string to add to the write stream

                // If iterations is 0, this will become the last piece of data added to the file
                if (iterations === 0) {
                    writer.write(data, encoding, callback); // Writing final piece of data to the file and calling the callback function
                } else {
                    ok = writer.write(data, encoding); // Write to the file and return 'true' if the stream can take further data, or 'false' if it can't
                }
            } while (iterations > 0 && ok); // The loop ends if 'iterations' is equal to 0 or the write stream can't take further data

            // If more records need to be written
            if (iterations > 0) {
                writer.once('drain', writeSongData); // Wait until the write stream emits a 'drain' event (indicating completion) then re-run writeAlbumData
            }
        }

        writeSongData(); // Execute the function to write data
    }

    // Execute the function to write the song file
    writeSongFile(songWriteStream, 'utf-8', () => {
        songWriteStream.end();
    });
}

// Generate the user file
function userDataGeneration() {
    var userStream = fs.createWriteStream(path.resolve(dataFolder, 'user.csv')); // Establish write stream

    var userHeader = 'user_id,user_name,user_avatar_url,follower_count'; // Create headers row
    userStream.write(userHeader + '\n'); // Add headers row to the file

    // Loop to create all entries of users in the file
    for (var i = 1; i <= MAX_USER_COUNT; i++) {
        var newRecord = []; // Data 'chunk'

        newRecord.push(i); // User ID
        newRecord.push(faker.internet.userName()); // User Name
        newRecord.push(faker.image.imageUrl()); // User Avatar URL
        newRecord.push(faker.random.number({min: 0, max: 10000})); // Follower Count

        userStream.write(newRecord.join(',') + '\n'); // Write 'newRecord' to file
    }

    userStream.end(); // End write stream
}

// Generate the playlist file
function playlistDataGeneration() {
    var playlistStream = fs.createWriteStream(path.resolve(dataFolder, 'playlist.csv')); // Establish write stream

    var playlistHeader = 'playlist_id,playlist_name,playlist_art_url'; // Create headers row
    playlistStream.write(playlistHeader + '\n'); // Add headers row to the file

    // Loop to create all entries of the playlist in the file
    for (var i = 1; i <= MAX_PLAYLIST_COUNT; i++) {
        var newRecord = []; // Data 'chunk'

        newRecord.push(i); // Playlist ID
        newRecord.push(faker.company.catchPhrase()); // Playlist Name
        newRecord.push(faker.image.imageUrl()); // Playlist Avatar URL

        playlistStream.write(newRecord.join(',') + '\n'); // Write 'newRecord' to file
    }

    playlistStream.end(); // End write stream
}

songDataGeneration();
