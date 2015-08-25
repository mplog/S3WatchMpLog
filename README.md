# S3WatchMpLog
A Node.js AWS Lambda script that push mplogs alert to Slack.

## Get the code and prep it for the uploading to AWS
* Clone the git repo
```bash
git clone http://git.gmf.io/mplog/S3WatchMpLog.git
cd S3WatchMpLog
```

* Install require npm packages.
```
npm install
```
* zip up your code
```
zip -r S3WatchMpLog.zip S3WatchMpLog.js node_modules
```
The resulting zip (S3WatchMpLog.zip) is what you will upload to AWS in step 1 below.

## Setting up AWS
For all of the AWS setup, I used the AWS console following [this example](http://docs.aws.amazon.com/lambda/latest/dg/getting-started-amazons3-events.html).  Below, you will find a high-level description of how to do this.  I also found [this blog post](http://alestic.com/2014/11/aws-lambda-cli) on how to set things up using the command line tools.

### Create and upload the S3WatchMpLog Lamba function in the AWS Console
1. Create lambda function
  1. https://console.aws.amazon.com/lambda/home
  2. Click "Create a Lambda function" button. *(Choose "Upload a .ZIP file")*
    * **Name:** *S3WatchMpLog*
    * Upload lambda function (zip file you made above.)
    * **Handler*:** *S3WatchMpLog.handler*
    * **Role*:** In the drop down click "S3 execution role". (This will open a new window to create the role.)
    * I left the memory at 128MB.  
    * Same advice for Timer, I set it to 5 seconds.
2. Configure Event Source to call S3WatchMpLog when logs added to S3 bucket.
  1. https://console.aws.amazon.com/lambda/home
  2. Make sure the S3WatchMpLog lambda function is selected, then click 'Actions->Add event source'
    * **Event source type:** S3
    * **Bucket:** Choose the S3 bucket that contains your logs.
    * **Event type:** Put


