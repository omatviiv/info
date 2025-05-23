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
- SSO start url: take from IAM IC > Dashboard > Access portal url
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
7. On your domain provider create a CNAME record with name `mysite` omitting domain.com
and value `your-bucket-name.s3-website.eu-central-1.amazonaws.com`.
Also delete any A records that might be present for the same name because they
will take precedence over CNAME record.




# Certificate Manager (ACM)
Here certificates can be created for the domain. App public ACM certificates
are free and you only pay for traffict etc.

To create a certificate for a domain or all first level of subdomains:
0. IMPORTANT: if you plane to use this certificate with CloudFron then create
them in `us-east-1` region because CloudFront is global CDN and it can only access
certificates from AWS main region which is `us-east-1` North Virginia.
1. ACM > Request a certificate > Request a public certificate
2. Add domain name as `*.domain.com` > Next
3. Select DNS validation > Next > Review > Confirm and request
4. Create CNAME DNS record on your domain provider using values specified in
section called Domains. Use CNAME name and CNAME value.
GoDaddy doesn't allow CNAME name to contain domain.com. So in case ACM it will
require to add CNAME name something like _12lverwoipvjfdsnvjrw3143214321.domain.com.
For GoDaddy to work properly it should be _12lverwoipvjfdsnvjrw3143214321.
5. After DNS record is created and certificate listed as issued and domain verifictaion
listed as successfull, configure CloudFront to use this certificate for the S3 bucket.




# CloudFront
0. BEFORE creating CloudFront distribution make sure that there is CNAME record on
your DNS provider for the S3 bucket website endpoing:
`your-bucket-name.s3-website.eu-central-1.amazonaws.com`
For website mysite.domain.com it should be:
CNAME mysite s3-bucket-name-for-mysite.s3-website.eu-central-1.amazonaws.com
1. Create distribution
2. Origin domain: select the S3 bucket
It has to be s3 bucket website endpoint, not the bucket itself:
`your-bucket-name.s3-website.eu-central-1.amazonaws.com`
3. Protocol: HTTP only
4. Name: My Site - it can be anything that helps to identify the distribution
5. Default Cache Behavior Settings:
- Viewer Protocol Policy: Redirect HTTP to HTTPS
6. Settings:
- Alternate Domain Names (CNAMEs): mysite.domain.com
- Custom SSL Certificate: select the certificate created in ACM (us-east-1 only)
- Default Root Object: index.html
7. Disable WAF for security
8. Create distribution
9. Modify DNS record and replace CNAME mysite value fro s3 bucket website to
CloudFront distribution domain name, which should be something likke:
`d4y0e7v6ugjsy.cloudfront.net`
10. To make sure that CloudFront distribution has access to S3 we need to
explicitly grant access. So go to S3 bucket > Permissions > Bucket policy
> Edit and add one more statement:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    ...other statements...,
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": {
          "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::advocate.matviiv/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/CLOUD_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```




# Route 53
As godaddy doesn't allow to create CNAME record for root domain like vakull.com
and it doesn't have ANAME record type adding A record with IP address of the
cloudfront distribution url is not reliable because IP address can change.
So we need to use Route 53 with ALIAS record to resolve this:
1. Open Route 53 on AWS console.
2. Hosted zones > Create hosted zone:
  - Domain name: vakull.com
  - Type: Public hosted zone
3. click Create Hosted Zone
4. Route 53 > Hosted zones > vakull.com > Create record:
  - Record name: leave empty
  - Record type: A - Routes traffic to an IPv4 address and/or AWS resource.
  - Alias toggle - switch to Yes
  - Route traffic to: select Alias to CloudFront distribution
  - Alias target: select the CloudFront distribution
  - Routing policy: Simple routing
5. click Create records
6. Change nameservers on GoDaddy:
  - GoDaddy > Domains > vakull.com > DNS Management > Nameservers
  - Change > Enter custom nameservers > add all 4 nameservers from Route 53
    NS record only (ignore nameservers from SOA record)
  - click Save
  (it may take 24-48 hours for the changes to propagate)
