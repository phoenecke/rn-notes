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
