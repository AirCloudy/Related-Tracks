const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "neo4j"));

const getSong = (song_id, res) => {
  var session = driver.session();
  const cypher = 'MATCH (song:Song {id: {id} }) RETURN song';
  const params = {id: song_id};
  console.log(params);
  return session
    .run(cypher, params)
    .then(result => {
      session.close();
      console.log(result);
      res.send(result.records);
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

exports.getSong = getSong;