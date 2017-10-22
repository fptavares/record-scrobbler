var AWS = require("aws-sdk");

AWS.config.loadFromPath('./aws-config.json');

var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: "CollectionAlbum",
    ProjectionExpression: "id, dateAdded, info"
};

console.log("Scanning CollectionAlbum table.");
docClient.scan(params, onScan);

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        data.Items.forEach(function(album) {
           console.log(
                album.dateAdded + ": ",
                album);
        });

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}
