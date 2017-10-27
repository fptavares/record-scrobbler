var AWS = require("aws-sdk");

AWS.config.loadFromPath('./aws-config.json');

var docClient = new AWS.DynamoDB.DocumentClient();

var ttl = Math.floor(Date.now() / 1000);

var params = {
  TableName: "CollectionAlbum",
  Item: {
    "id": 12345,
    "dateAdded": "2017-09-14T19:58:04+00:00",
    "ttl": ttl,
    "info": {
      "plot": "Nothing happens at all.",
      "rating": 0
    }
  }
};

console.log("Adding a new item...");
docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});
