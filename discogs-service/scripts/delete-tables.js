var AWS = require("aws-sdk");

AWS.config.loadFromPath('./aws-config.json');

function deleteTable(tableName) {
  var dynamodb = new AWS.DynamoDB();

  var params = {
    TableName: tableName
  };

  dynamodb.deleteTable(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

deleteTable("User");
deleteTable("CollectionAlbum");
deleteTable("Release")
