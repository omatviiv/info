# IAM - Identity and Access Management
IAM Identity Center (IAM AC) is newer approach.
Plus there is newer version of aws cli that doesn't require traditional access
keys. New cli can authorize using IAM AC without a need to store any
credentials on the PC.


## Create IAM IC user
1. Make sure correct region is selected because IAM IC is region specific. 
2. IAM IC > Users > Add user (give it some name and leave all defaults)
3. Permission sets > Create permission set > Custom permission set > Next
 >  Inline policy > Create policy > Add this policy:
!!! don't forget to replace **your-bucket-name** with the actual bucket name
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::your-bucket-name"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```
 > Next > Give name and description indicating that its for specific S3 bucket
 > Next > Create
4. IAM IC > AWS accounts > select account > Assign users or groups > Next
 > Users > select user > Next > Assign permissions > Next > Submit




# AWS CLI
1. install aws cli follow: [https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions]()
2. Make sure IAM IC user is created with some permissions.
3. aws configure sso
- SSO session name: omatviiv-sso 
- SSO start url: take from IAM IC > Dashboard > Access portal rul
- SSO region: eu-central-1
- SSO registration scropes: leave defaults
- approve in browser
- specify client region eu-central-1
- default output format: json
4. aws sso login --profile S3bucketAdvocateMatviiv-653070186733
where S3bucketAdvocateMatviiv-653070186733 is the profile name from the previous step
this can also be taken from ~/.aws/config file




# S3 Bucket for static website
1. Select a region in AWS console on the top right next to your account.
2. Create a bucket with defaults.
3. Permissions > Edit block public access and disable any blockages.
4. Permissions > Edit bucket policy by adding this json:
!!! don't forget to replace **your-bucket-name** with the actual bucket name
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```
5. Put website files in the bucket.
6. Properties > Edit Static website hosting > Enable > Index document: index.html
