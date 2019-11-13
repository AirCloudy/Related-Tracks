const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "neo4j"));

const getSong = (song_id, res) => {
  var session = driver.session();
  const params = {id: song_id};
  
  return Promise.all([
    session.run('MATCH (song:Song {id: {id} }) RETURN song.name', params),
    session.run('MATCH (song:Song {id: {id} })-[:APPEARS_ON]->(album:Album) RETURN album', params)
  ])
  .then(result => {
    res.send(result);
    session.close();
  })
  .catch(error => {
    session.close();
    throw error;
  });
}

const postSong = (song_data, res) => {
  var session = driver.session();
  const cypherCreateSong = 'CREATE (song:Song {name: {songname}, art: {songart}, year: {songyear}})';
  const cypherCreateSongParams = {songname: song_data.songname, songart: song_data.songart, songyear: song_data.songyear};

  session.run(cypherCreateSong, cypherCreateSongParams)
    .then(result => {
      res.status(200);
      res.end();
    })
    .catch(error => {
      res.status(500);
      res.end();
      throw error;
    });
  }

exports.getSong = getSong;
exports.postSong = postSong;