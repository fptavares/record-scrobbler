var AWS = require("aws-sdk");

AWS.config.loadFromPath('./aws-config.json');
var dynamodb = new AWS.DynamoDB();

function createTable(
    tableName,
    rcu,
    wcu,
    partitionKey,
    partitionKeyType,
    sortKey,
    sortKeyType) {
  var keySchema = [ { AttributeName: partitionKey, KeyType: "HASH"} ];
  var definitions = [ { AttributeName: partitionKey, AttributeType: partitionKeyType } ];

  if (sortKey) {
    keySchema.push({ AttributeName: sortKey, KeyType: "RANGE" });
    definitions.push({ AttributeName: sortKey, AttributeType: sortKeyType });
  }

  var createParams = {
    TableName : tableName,
    KeySchema: keySchema,
    AttributeDefinitions: definitions,
    ProvisionedThroughput: {
      ReadCapacityUnits: rcu,
      WriteCapacityUnits: wcu
    }
  };

  dynamodb.createTable(createParams, function(err, data) {
    if (err) {
      console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Created table.");//" Table description JSON:", JSON.stringify(data, null, 2));
      enableTTL(tableName);
    }
  });
}

function enableTTL(tableName) {
  var ttlParams = {
    TableName: tableName,
    TimeToLiveSpecification: {
      AttributeName: 'ttl',
      Enabled: true
    }
  };

  dynamodb.updateTimeToLive(ttlParams, function(err, data) {
    if (err) {
      console.error("Failed to enable TTL.");//" Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Enabled TTL.");//" JSON response:", JSON.stringify(data, null, 2));
    }
  });
}

// create tables
createTable("User", 1, 1, "username", "S");
createTable("CollectionAlbum", 24, 24, "username", "S", "id", "N");
//createTable("Release", "releaseId", "N");
