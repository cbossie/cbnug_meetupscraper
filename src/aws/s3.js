const AWS = require('aws-sdk');

class S3 {

    constructor(bucket,region = 'us-east-1'){
        this.region = region;
        this.bucket = bucket;
        this.initialize(region);
    }

    initialize(region){
        AWS.config.update({
            region: region
        });

        this.cli = new AWS.S3({
            region: this.region
        });


    }

    async objectExists(key){
        let result = false;
       let param = {
            Bucket: this.bucket,
            Key: key
        };
       
        try
        {
            let h = await this.cli.headObject(param).promise();
            result = true;
        }
        catch(err){
            console.log(err);
            result = false;
        }

        return result;
    }

    async putObject(key, buffer, contentType){
        let result = false;
        let param = {
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType
        };

        try {
            await this.cli.putObject(param).promise();
            console.log(`Put item ${key} into ${this.bucket}`);
        }
        catch(err) {
            console.log(`Error putting item ${key} into ${this.bucket}`);
            console.log(err);
        }

    }


}

exports.S3 = S3;
