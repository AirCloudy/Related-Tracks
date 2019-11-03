const fs = require('fs');
const faker = require('faker');
const path = require('path');

// Creating variable for the destination folder of all generated data
var dataFolder = path.join(__dirname, 'data');

var MAX_ARTIST_COUNT = 100000; // # of artists to be generated
var MAX_ALBUM_COUNT = 20000; // # of albums to be generated
var MAX_SONG_COUNT = 10000000; // # of songs to be generated
var MAX_USER_COUNT = 100000; // # of users to be generated
var MAX_PLAYLIST_COUNT = 20000; // # of playlists to be generated
var MAX_GENRE_COUNT = 100; // # of genres to be generated
var MAX_LIKES_COUNT = 50000000; // # of likes to be generated
var MAX_REPOSTS_COUNT = 50000000; // # of reposts to be generated

var joined_years_array = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]; // Pre-populating possible selections for the year a user or artist joined
var created_years_array = []; // Creating an array to store possible years that a song, playlist, or album was created

// Populating 'created_years_array' with year values starting from 1900
for (var i = 0; i < 120; i++) {
    created_years_array.push(1900 + i);
}

// Artist File Generator
function artistDataGeneration() {
    var artistHeader = 'artist_id, artist_name, artist_avatar_url, artist_city, artist_year_joined, artist_pro_unlimited'; // Creating table headers
    var artistStream = fs.createWriteStream(path.resolve(dataFolder, 'artist.csv')); // Establishing write stream for the file

    artistStream.write(artistHeader + '\n'); // Adding headers to the file

    var iterations = MAX_ARTIST_COUNT / 1000; // Defining the number of iterations to be run by the initial for loop on line 34

    // Beginning the data generation loop
    for (var i = 0; i < iterations; i++) {
        var newRecord = []; // Creating a variable to store data chunk

        var idIncrement = i * 1000; // This variable ensure that there will be unique IDs generated between 1 and the maximum artist count

        // Generating data for the data chunk, which the write stream will process
        for (var n = 1; n <= 1000; n++) {
            newRecord.push(n + idIncrement); // Artist ID
            newRecord.push(faker.internet.userName()) // Artist Name
            newRecord.push(faker.image.imageUrl()); // Artist Avatar URL
            newRecord.push(faker.address.city()); // Artist City
            newRecord.push(joined_years_array[faker.random.number({min: 0, max: 9})]); // Artist Date Joined
            newRecord.push(n % 2 === 0 ? false : true) // Indicator for Pro Unlimited
            newRecord.push('\n'); // Ensuring new line is created
        }

        artistStream.write(newRecord.join(',')); // Converting the array into a string and writing that string to the file
    }

    artistStream.end(); // Ending the write stream
}

// Album File Generator
function albumDataGeneration() {
    var albumHeader = 'album_id, album_name, album_art_url, album_year_created, artist_id'; // Creating table headers

    // This generator has two methods for data generation. The first is to generate random string values from Faker for 'album_name' and
    // 'album_art_url'. The second is to pre-populate an album name array, and album art URL array with fake data, then use those to
    // quickly generate data while writing the file. Pre-populating has the effect of drastically decreasing the time taken to write
    // the file. Ten million records takes 17 seconds to write with the pre-population method, whereas it takes approximately 7 minutes
    // to generate ten million records that each have a album name and album art URL generated randomly on creation. For this project,
    // it's likely sufficient to use the pre-populated method, but when considering the use of a DB like Neo4j, having unique string
    // values is preferable.

    var albumNameChoices = []; // Creating array to store pre-populated album names
    
    // Generating values for the 'albumNameChoices' array
    for (var i = 0; i < 1000; i++) {
        albumNameChoices.push(faker.company.catchPhrase());
    }
    
    var albumArtUrlChoices = []; // Creating array to store pre-populated album art URLs
    
    // Generating values for the 'albumArtUrlChoices' array
    for (var i = 0; i < 1000; i++) {
        albumArtUrlChoices.push(faker.image.imageUrl());
    }

    var albumWriteStream = fs.createWriteStream(path.resolve(dataFolder, 'album.csv')); // Establishing the write stream for the album file 

    // Defining the function which will handle writing the actual file. The function takes three parameters: 'writer' (a write stream), 'encoding'
    // (the encoding to use), and a callback function that will be run when writing has completed. 
    function writeAlbumFile(writer, encoding, callback) {
        writer.write(albumHeader + '\n'); // Adding headers to the album file
        
        var iterations = MAX_ALBUM_COUNT; // Defining the number of entries to write to the file
        let id = 0; // Initializing the ID value for each entry
        
        // Defining the function that will write data to the file
        function writeAlbumData() {
            let ok = true; // This variable indicates whether the write stream can handle more data
            
            // Starting a loop to add additional data to the file
            do {
                iterations -= 1; // Ensures the iterations variable is decremented for each record written
                id += 1; // Ensures the correct id value is used for each record

                const album_id = id; // Album ID
                // THIS NEXT VARIABLE IS ONLY USED FOR THE PRE-POPULATED DATA GENERATION METHOD
                    // const album_name = albumNameChoices[(id % 1000)];
                const album_name = faker.company.catchPhrase(); // Album Name
                const album_year_created = created_years_array[faker.random.number({min: 0, max: 119})]; // Album Year Created
                // THIS NEXT VARIABLE IS ONLY USED FOR THE PRE-POPULATED DATA GENERATION METHOD
                    // const album_art_url = albumArtUrlChoices[(id % 1000)];
                const album_art_url = faker.image.imageUrl(); // Album Art URL
                const artist_id = faker.random.number({min: 1, max: MAX_ARTIST_COUNT}); // Artist ID

                const data = `${album_id}, ${album_name}, ${album_year_created}, ${album_art_url}, ${artist_id}\n`; // Creating string to add to the write stream

                // If iterations is 0, this will become the last piece of data added to the file
                if (iterations === 0) {
                    writer.write(data, encoding, callback); // Writing final piece of data to the file and calling the callback function
                } else {
                    ok = writer.write(data, encoding); // Write to the file and return 'true' if the stream can take further data, or 'false' if it can't
                }
            } while (iterations > 0 && ok); // The loop ends if 'iterations' is equal to 0 or the write stream can't take further data

            // If more records need to be written
            if (iterations > 0) {
                writer.once('drain', writeAlbumData); // Wait until the write stream emits a 'drain' event (indicating completion) then re-run writeAlbumData
            }
        }

        writeAlbumData(); // Execute the function to write data
    }

    // Execute the function to write the album file
    writeAlbumFile(albumWriteStream, 'utf-8', () => {
        albumWriteStream.end();
    });
}


function songDataGeneration() {
    var songHeader = 'song_id, song_name, song_year_created, song_art_url, comment_count, artist_id, album_id'; // Creating table headers
    
    // This script has two methods for data generation. The first is to generate random string values from Faker for 'song_name' and
    // 'song_art_url'. The second is to pre-populate a song name array and song art URL array with fake data, and then use those to
    // quickly generate data while writing the file. Pre-populating has the effect of drastically decreasing the time taken to write
    // the file. Ten million records takes 17 seconds to write with the pre-population method, whereas it takes approximately 7 minutes
    // to generate ten million records that each have a song name and song art URL generated randomly on creation. For this project,
    // it's likely sufficient to use the pre-populated method, but when considering the use of a DB like Neo4j, having unique string
    // values is preferable.

    var songNameChoices = []; // Creating array to store pre-populated song names
    
    // Generating values for the 'songNameChoices' array
    for (var i = 0; i < 1000; i++) {
        songNameChoices.push(faker.company.catchPhrase());
    }
    
    var songArtUrlChoices = []; // Creating array to store pre-populated song art URLs
    
    // Generating values for the 'songArtUrlChoices' array
    for (var i = 0; i < 1000; i++) {
        songArtUrlChoices.push(faker.image.imageUrl());
    }
    
    var songWriteStream = fs.createWriteStream(path.resolve(dataFolder, 'song.csv')); // Establishing write stream
    
    // Defining the function which will handle writing the actual file. The function takes three parameters: 'writer' (a write stream), 'encoding'
    // (the encoding to use), and a callback function that will be run when writing has completed. 
    function writeSongFile(writer, encoding, callback) {
        writer.write(songHeader + '\n'); // Writing headers to the file
        
        var iterations = MAX_SONG_COUNT; // Number of records to add to the file
        let id = 0; // Initializing the ID value for each entry
        
        // Defining the function that will write data to the file
        function writeSongData() {
            let ok = true; // This variable indicates whether the write stream can handle more data
            
            // Starting a loop to add additional data to the file      
            do {
                iterations -= 1; // Ensures the iterations variable is decremented for each record written
                id += 1; // Ensures the correct id value is used for each record

                const song_id = id; // Song ID
                // THIS NEXT VARIABLE IS ONLY USED FOR THE PRE-POPULATED DATA GENERATION METHOD
                    // const song_name = songNameChoices[(id % 1000)];
                const song_name = faker.company.catchPhrase(); // Song Name
                const song_year_created = created_years_array[faker.random.number({min: 0, max: 119})]; // Song Year Created 
                // THIS NEXT VARIABLE IS ONLY USED FOR THE PRE-POPULATED DATA GENERATION METHOD
                    // const song_art_url = songArtUrlChoices[(id % 1000)];
                const song_art_url = faker.image.imageUrl(); // Song Art URL
                const comment_count = faker.random.number({min: 0, max: 10000}); // Comment Count
                const artist_id = faker.random.number({min: 1, max: MAX_ARTIST_COUNT}); // Artist ID
                const album_id = faker.random.number({min: 1, max: MAX_ALBUM_COUNT}); // Album ID

                const data = `${song_id}, ${song_name}, ${song_year_created}, ${song_art_url}, ${comment_count}, ${artist_id}, ${album_id}\n`; // Creating string to add to the write stream

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

    var userHeader = 'user_id, user_name, user_avatar_url, follower_count'; // Create headers row
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

    var playlistHeader = 'playlist_id, playlist_name, playlist_art_url, user_id, artist_id'; // Create headers row
    playlistStream.write(playlistHeader + '\n'); // Add headers row to the file

    // Loop to create all entries of the playlist in the file
    for (var i = 1; i <= MAX_PLAYLIST_COUNT; i++) {
        var newRecord = []; // Data 'chunk'

        // Playlists can be created by either users or artist. If the current id is divisble by 3, then add an artist id, or null if it's not. If
        // not divisible by three, then add a user id, or null if not.
        var user_id = i % 3 !== 0 ? faker.random.number({min: 1, max: MAX_USER_COUNT}) : 'null';
        var artist_id = i % 3 === 0 ? faker.random.number({min: 1, max: MAX_ARTIST_COUNT}) : 'null';

        newRecord.push(i); // Playlist ID
        newRecord.push(faker.company.companyName()); // Playlist Name
        newRecord.push(faker.image.imageUrl()); // Playlist Avatar URL
        newRecord.push(user_id); // User ID
        newRecord.push(artist_id); // Artist ID

        playlistStream.write(newRecord.join(',') + '\n'); // Write 'newRecord' to file
    }

    playlistStream.end(); // End write stream
}

// Generate genre file
function genreDataGeneration() {
    var genreStream = fs.createWriteStream(path.resolve(dataFolder, 'genre.csv')); // Establish write stream

    var genreHeader = 'genre_id, genre_name'; // Headers
    genreStream.write(genreHeader + '\n'); // Write headers to file

    // Loop to create all entries of genres in the file
    for (var i = 1; i <= MAX_GENRE_COUNT; i++) {
        var newRecord = []; // Data 'chunk'

        newRecord.push(i); // Genre ID
        newRecord.push(faker.name.title()); // Genre Name

        genreStream.write(newRecord.join(',') + '\n'); // Write 'newRecord' to file
    }

    genreStream.end(); // End write stream
}

// Generate likes file
function likesDataGeneration() {
    var likesHeader = 'likes_id, user_id, artist_id, song_id, playlist_id'; // Headers
    
    var likesWriteStream = fs.createWriteStream(path.resolve(dataFolder, 'likes.csv')); // Establish write stream
    
    // Defining the function which will handle writing the actual file. The function takes three parameters: 'writer' (a write stream), 'encoding'
    // (the encoding to use), and a callback function that will be run when writing has completed. 
    function writeLikesFile(writer, encoding, callback) {
        writer.write(likesHeader + '\n'); // Write headers to file
        
        var iterations = MAX_LIKES_COUNT; // Number of records to add to the file
        let id = 0; // Initializing the ID value for each entry
        
        // Defining the function that will write data to the file
        function writeLikesData() {
            let ok = true; // This variable indicates whether the write stream can handle more data
            
            // Starting a loop to add additional data to the file      
            do {
                iterations -= 1; // Ensures the iterations variable is decremented for each record written
                id += 1; // Ensures the correct id value is used for each record

                var likes_id = id; // Likes ID
                var user_id = id % 10 !== 0 ? faker.random.number({min: 1, max: MAX_USER_COUNT}) : 'null'; // User ID
                var artist_id = id % 10 === 0 ? faker.random.number({min: 1, max: MAX_ARTIST_COUNT}) : 'null'; // Arist ID
                var song_id = id % 5 !== 0 ? faker.random.number({min: 1, max: MAX_SONG_COUNT}) : 'null'; // Song ID
                var playlist_id = id % 5 === 0 ? faker.random.number({min: 1, max: MAX_PLAYLIST_COUNT}) : 'null'; // Playlist ID

                const data = `${likes_id}, ${user_id}, ${artist_id}, ${song_id}, ${playlist_id}\n`; // Add data to single string

                // If iterations is 0, this will become the last piece of data added to the file
                if (iterations === 0) {
                    writer.write(data, encoding, callback); // Writing final piece of data to the file and calling the callback function
                } else {
                    ok = writer.write(data, encoding); // Write to the file and return 'true' if the stream can take further data, or 'false' if it can't
                }
            } while (iterations > 0 && ok); // The loop ends if 'iterations' is equal to 0 or the write stream can't take further data

            // If more records need to be written
            if (iterations > 0) {
                writer.once('drain', writeLikesData); // Restart writing data once the write stream has emitted the drain event
            }
        }

        writeLikesData(); // Execute data writing
    }

    // Execute file creation
    writeLikesFile(likesWriteStream, 'utf-8', () => {
        likesWriteStream.end();
    });
}

// Data generation for reposts -- exact same thing as likes
function repostsDataGeneration() {
    var repostsHeader = 'reposts_id, user_id, artist_id, song_id, playlist_id';
    
    var repostsWriteStream = fs.createWriteStream(path.resolve(dataFolder, 'reposts.csv'));
    
    function writeRepostsFile(writer, encoding, callback) {
        writer.write(repostsHeader + '\n');
        
        var iterations = MAX_REPOSTS_COUNT;
        let id = 0;
        
        function writeRepostsData() {
            let ok = true;
            
            do {
                iterations -= 1;
                id += 1;

                var reposts_id = id;
                var user_id = id % 10 !== 0 ? faker.random.number({min: 1, max: MAX_USER_COUNT}) : 'null';
                var artist_id = id % 10 === 0 ? faker.random.number({min: 1, max: MAX_ARTIST_COUNT}) : 'null';
                var song_id = id % 5 !== 0 ? faker.random.number({min: 1, max: MAX_SONG_COUNT}) : 'null';
                var playlist_id = id % 5 === 0 ? faker.random.number({min: 1, max: MAX_PLAYLIST_COUNT}) : 'null';

                const data = `${reposts_id}, ${user_id}, ${artist_id}, ${song_id}, ${playlist_id}\n`;

                if (iterations === 0) {
                    writer.write(data, encoding, callback);
                } else {
                    ok = writer.write(data, encoding);
                }
            } while (iterations > 0 && ok);

            if (iterations > 0) {
                writer.once('drain', writeRepostsData);
            }
        }

        writeRepostsData();
    }

    writeRepostsFile(repostsWriteStream, 'utf-8', () => {
        repostsWriteStream.end();
    });
}

// Generates a file to store relations between songs and playlists
function songPlaylistDataGeneration() {
    var songPlaylistStream = fs.createWriteStream(path.resolve(dataFolder, 'song_playlist.csv')); // Establish write stream

    var songPlaylistHeader = 'song_id, playlist_id'; // Headers
    songPlaylistStream.write(songPlaylistHeader + '\n'); // Write headers to file

    // Loop through for the number of songs there are
    for (var i = 1; i <= MAX_SONG_COUNT; i++) {
        var newRecord = []; // Create data 'chunk'

        newRecord.push(faker.random.number({min: 1, max: MAX_SONG_COUNT})); // Song ID
        newRecord.push(faker.random.number({min: 1, max: MAX_PLAYLIST_COUNT})); // Playlist ID

        songPlaylistStream.write(newRecord.join(',') + '\n'); // Write data to file
    }

    songPlaylistStream.end(); // End stream
}

// Generate a file to store relations between songs and genres
function songGenreDataGeneration() {
    var songGenreHeader = 'song_id, genre_id'; // Headers
    
    var songGenreWriteStream = fs.createWriteStream(path.resolve(dataFolder, 'song_genre.csv')); // Establish write stream
    
    // Function to write the file
    function writeSongGenreFile(writer, encoding, callback) {
        writer.write(songGenreHeader + '\n'); // Add headers to file
        
        var iterations = MAX_LIKES_COUNT; // Number of iterations
        let id = 0; // ID to be used
        
        function writeSongGenreData() {
            let ok = true; // Indicates whether the write stream can take more data without buffering
            
            // Generate data and push to write stream
            do {
                iterations -= 1; // Decrement iterations for each record created
                id += 1; // Generate id increment for song

                var song_id = id % 10000000 === 0 ? 10000000 : id % 10000000; // Song ID
                var genre_id = faker.random.number({min: 1, max: MAX_GENRE_COUNT}); // Genre ID

                const data = `${song_id}, ${genre_id}\n`; // Piece data together

                // If last entry
                if (iterations === 0) {
                    writer.write(data, encoding, callback); // Write data and run callback
                } else {
                    ok = writer.write(data, encoding); // Write data and indicate whether write stream can take more
                }
            } while (iterations > 0 && ok); // End loop if iterations is 0 or write stream can't take more

            // If more data to be written
            if (iterations > 0) {
                writer.once('drain', writeSongGenreData); // Re-run writing function once write stream has emitted drain event
            }
        }

        writeSongGenreData(); // Execute data writing
    }

    // Execute file creation
    writeSongGenreFile(songGenreWriteStream, 'utf-8', () => {
        songGenreWriteStream.end();
    });
}

// This is the same function as songGenreDataGeneration, but for playlists
function songPlaylistDataGeneration() {
    var songPlaylistHeader = 'song_id, playlist_id';
    
    var songPlaylistWriteStream = fs.createWriteStream(path.resolve(dataFolder, 'song_playlist.csv'));
    
    function writeSongPlaylistFile(writer, encoding, callback) {
        writer.write(songPlaylistHeader + '\n');
        
        var iterations = MAX_LIKES_COUNT;
        let id = 0;
        
        function writeSongPlaylistData() {
            let ok = true;
            
            do {
                iterations -= 1;
                id += 1;

                var song_id = id % 10000000;
                var playlist_id = faker.random.number({min: 1, max: MAX_PLAYLIST_COUNT});

                const data = `${song_id}, ${playlist_id}\n`;

                if (iterations === 0) {
                    writer.write(data, encoding, callback);
                } else {
                    ok = writer.write(data, encoding);
                }
            } while (iterations > 0 && ok);

            if (iterations > 0) {
                writer.once('drain', writeSongPlaylistData);
            }
        }

        writeSongPlaylistData();
    }

    writeSongPlaylistFile(songPlaylistWriteStream, 'utf-8', () => {
        songPlaylistWriteStream.end();
    });
}

// Execute all data generation
artistDataGeneration();
albumDataGeneration();
songDataGeneration();
userDataGeneration();
playlistDataGeneration();
genreDataGeneration();
likesDataGeneration();
repostsDataGeneration();
songPlaylistDataGeneration();
songGenreDataGeneration();