const AWS = require("aws-sdk");

class DynamoDB {

    constructor(region = 'us-east-1', table){
        this.table = table;
        this.initialize(region);
    }

    initialize(region){
        AWS.config.update({
            region: region
        });
        
        this.cli = new AWS.DynamoDB.DocumentClient({
            table: this.table,
            region: this.region
        });
        
    }

    async getAll(){
        return await this.cli.scan({
            TableName: this.table
        }).promise();
    };

    async putItem(item){
        return this.cli.put({
            TableName: this.table,
            Item: item
        }).promise();
    }

    async delete(name) {
        return this.cli.delete({
            TableName: this.table,
            Key: {
                name: name
            }
        }).promise();
    }


}


exports.DynamoDB = DynamoDB;