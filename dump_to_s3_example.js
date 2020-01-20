var mysqldump = require('mysqldump');
const fs = require('fs');
const AWS = require('aws-sdk');
//AWS Configs
const ID = '<AWS KEY>';
const SECRET = '<AWS Secret>';
const BUCKET_NAME = '<AWS S3 Bucket Name>';
///

let dbHost = '<DB Host>';
let dbUser = '<DB User>';
let dbPassword = '<DB Password>';
let dbName = '<Database name>';
let dumpName = dbName + Date.now() + '.sql';

getDBBackup();

async function getDBBackup(){
    // do some asynchronous work
    // and when the asynchronous stuff is complete
    await mysqldump({
        connection: {
            host: dbHost,
            user: dbUser,
            password: dbPassword,
            database: dbName,
            },
            dumpToFile: './' + dumpName,
        });
        console.log('Database backup successfully created.');
       

        //Upload to S3
        uploadToS3(dumpName);

   // return;
    
}

function uploadToS3(fileName) {
  

  const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
  });

  const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName, // File name you want to save as in S3
      Body: fileContent
    };

    // Uploading files to the bucket
    s3.putObject(params, function (err, data) {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully.`);
      //Deleting the local file 

      fs.unlink('./'+dumpName,function(err){
        if(err) return console.log(err);
        console.log('Backup deleted successfully.');
      });
    });
  };

  uploadFile(fileName);

}
  