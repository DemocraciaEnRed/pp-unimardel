/* 
  Inicialmente no se estaba almacenando la Facultad en el Topic
  De manera preventiva a futuro se actualizan los Topics agregandole la facultad del usuario que lo cargo
*/

print('-- Updating topics --');

db.topics.find().forEach(t => {

  if (!t.facultad) {
    const topicId = t._id
    const zonaId = db.users.findOne({ _id: t.owner}).facultad
    if (zonaId) {
      db.topics.updateOne({"_id": topicId},
          { 
            $set: {
              "facultad" : zonaId
            }
          }
      )
      print(` Updating topic ${topicId} => Add facultad: ${zonaId}`);
    }
  }

});

print('-- Done --');

