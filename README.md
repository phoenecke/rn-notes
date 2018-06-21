# Notes with react-native, appsync, amplify

### AppSync Auth Type

For Auth type AWS_IAM, had to attach a policy to the "auth" cognito role:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "appsync:GraphQL"
            ],
            "Resource": [
                "arn:aws:appsync:<AWS region>:<AWS account ID>:apis/<app sync endpoint ID>/*"
            ]
        }
    ]
}
```

### Reconnect Existing AppSync Backend

Hopefully they will fix this at some point, AppSync is very new right now.

`awsmobile init <project-id>` should re-hook up appsync, like it hooks up all the other MobileHub managed features. But, if I lose the `appsync-info.json` file from the `.awsmobile` folder (re-clone, etc.), AppSync will not be hooked back up to the existing backend. To fix it, I have to manually create the file like this:

```
{
    "apiId": "XXXXX",
    "region": "XXXXX",
    "name": "rn-notes",
    "graphqlEndpoint": "https://XXXXX.appsync-api.XXXXX.amazonaws.com/graphql",
    "authenticationType": "AWS_IAM",
    "creationTime": "2018-06-11-22-52-41",
    "lastUpdateTime": "2018-06-11-22-52-41",
    "lastSyncTime": "2018-06-21-11-09-02",
    "lastPushSuccessful": true,
    "AppSyncConsoleUrl": "https://console.aws.amazon.com/appsync/home?region=XXXXX#/XXXXX/v1/home",
    "apiKey": null,
    "lastSyncToDevTime": "2018-06-21-11-09-05"
}
```
