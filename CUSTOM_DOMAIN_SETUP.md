# Custom Domain Setup for CloudFront / Amplify

This guide will help you set up a custom domain name (e.g., `www.yourdomain.com`) for your website currently hosted at `https://d3l7a9kbpl756w.cloudfront.net`.

## Prerequisites

1. **Domain Name**: You need to own a domain name (e.g., from Route 53, GoDaddy, Namecheap, etc.)
2. **AWS Account**: Access to AWS Console
3. **CloudFront Distribution**: Already exists (d3l7a9kbpl756w.cloudfront.net)

---

## Method 1: Using AWS Amplify (Recommended if using Amplify Hosting)

If your frontend is deployed via AWS Amplify, this is the easiest method.

### Step 1: Open Amplify Console
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your app
3. Go to **App Settings** → **Domain management**

### Step 2: Add Custom Domain
1. Click **Add domain**
2. Enter your domain name (e.g., `yourdomain.com`)
3. Choose subdomain:
   - `www.yourdomain.com` (for www)
   - `yourdomain.com` (for root domain)
   - Or both

### Step 3: Configure DNS
Amplify will provide DNS records to add:
- **A Record** or **CNAME** (depending on your DNS provider)
- Copy the provided values

### Step 4: Add DNS Records
Go to your domain registrar/DNS provider and add:
- **For www**: CNAME record pointing `www` to the Amplify-provided value
- **For root domain**: A/ALIAS record as provided by Amplify

### Step 5: SSL Certificate (Automatic)
- Amplify automatically provisions SSL certificate via AWS Certificate Manager (ACM)
- Certificate is valid for both `www` and root domain
- Usually takes 10-30 minutes to provision

### Step 6: Wait for DNS Propagation
- DNS changes can take 24-48 hours to propagate globally
- Usually works within 1-2 hours

---

## Method 2: Direct CloudFront Configuration

If you're using CloudFront directly (not through Amplify).

### Step 1: Request SSL Certificate in ACM

1. Go to [AWS Certificate Manager](https://console.aws.amazon.com/acm/)
2. Make sure you're in **US East (N. Virginia)** region (required for CloudFront)
3. Click **Request certificate**
4. Choose **Request a public certificate**
5. Enter domain names:
   - `yourdomain.com`
   - `www.yourdomain.com` (optional, for www subdomain)
6. Choose **DNS validation** (recommended)
7. Click **Request**

### Step 2: Validate Certificate (DNS)

1. ACM will provide CNAME records
2. Go to your domain registrar/DNS provider
3. Add the CNAME records provided by ACM:
   - Example:
     ```
     Name: _abc123.yourdomain.com
     Value: _xyz789.acm-validations.aws.
     ```
4. Wait for validation (usually 5-30 minutes)
5. Certificate status will change to **Issued**

### Step 3: Get CloudFront Distribution ID

1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Find distribution: `d3l7a9kbpl756w.cloudfront.net`
3. Click on it and note the **Distribution ID** (e.g., `E1ABC2DEF3GHI4`)

### Step 4: Update CloudFront Distribution

1. In CloudFront, select your distribution
2. Click **Edit**
3. Go to **General** tab → Click **Edit**

4. **Alternative Domain Names (CNAMEs)**:
   - Add: `yourdomain.com`
   - Add: `www.yourdomain.com` (if using www)

5. **SSL Certificate**:
   - Select **Custom SSL Certificate**
   - Choose the certificate you created in Step 1
   - Click **Save changes**
                
### Step 5: Configure DNS Records

Add DNS records at your domain registrar to point to CloudFront:

**For Route 53 (AWS):**
1. Go to [Route 53 Hosted Zones](https://console.aws.amazon.com/route53/)
2. Select your domain's hosted zone
3. Create **A Record (Alias)**:
   - **Record name**: Leave blank (for root) or `www`
   - **Record type**: A (IPv4) - with Alias ON
   - **Alias target**: Select CloudFront distribution
   - **Alias target**: Choose your CloudFront distribution from dropdown
   - Click **Create records**

**For Other DNS Providers (GoDaddy, Namecheap, etc.):**
You need to get the CloudFront distribution hostname:

1. In CloudFront, go to your distribution
2. Under **General** tab, find **Domain Name**: `d3l7a9kbpl756w.cloudfront.net`

3. Create DNS records:
   - **Type**: CNAME
   - **Name**: `@` (for root) or `www` (for www)
   - **Value**: `d3l7a9kbpl756w.cloudfront.net`
   - **TTL**: 3600 (or default)

**Note**: Some DNS providers don't support CNAME for root domain (@). Options:
- Use a DNS provider that supports ALIAS/ANAME (e.g., Route 53, Cloudflare)
- Use `www` subdomain only
- Use a redirect service

### Step 6: Wait for Changes to Propagate

- CloudFront distribution update: Usually 5-15 minutes
- DNS propagation: 24-48 hours (usually 1-2 hours)
- You can check status in CloudFront console

---

## Method 3: Using Route 53 with CloudFront

If your domain is in Route 53, this is the most seamless option.

### Step 1: Create Hosted Zone

1. Go to [Route 53 Hosted Zones](https://console.aws.amazon.com/route53/)
2. Click **Create hosted zone**
3. Enter your domain name
4. Click **Create**

### Step 2: Request SSL Certificate

Follow Step 1-2 from Method 2 (Request certificate in ACM, validate via DNS)

### Step 3: Update CloudFront

Follow Step 3-4 from Method 2 (Update CloudFront with CNAMEs and SSL certificate)

### Step 4: Create Route 53 Records

1. In Route 53 Hosted Zone, click **Create record**
2. Create **A Record (Alias)** for root domain:
   - **Record name**: Leave blank
   - **Record type**: A
   - **Alias**: ON
   - **Route traffic to**: Alias to CloudFront distribution
   - **CloudFront distribution**: Select your distribution
   - **Record routing policy**: Simple routing
   - Click **Create records**

3. Create **A Record (Alias)** for www subdomain:
   - **Record name**: `www`
   - **Record type**: A
   - **Alias**: ON
   - **Route traffic to**: Alias to CloudFront distribution
   - **CloudFront distribution**: Select your distribution
   - Click **Create records**

### Step 5: Update Nameservers

1. Copy the 4 nameservers from Route 53 Hosted Zone
2. Go to your domain registrar
3. Update nameservers to the Route 53 nameservers
4. Wait for propagation (24-48 hours)

---

## Quick Setup Script (If Using Route 53 + CloudFront)

You can automate this using AWS CLI:

```bash
# 1. Request SSL Certificate
aws acm request-certificate \
  --domain-name yourdomain.com \
  --subject-alternative-names www.yourdomain.com \
  --validation-method DNS \
  --region us-east-1

# 2. Get Certificate ARN (after validation)
CERT_ARN="arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERT_ID"

# 3. Get CloudFront Distribution ID
DISTRIBUTION_ID="E1ABC2DEF3GHI4"  # Get from CloudFront console

# 4. Get Current CloudFront Config
aws cloudfront get-distribution-config \
  --id $DISTRIBUTION_ID \
  --output json > cloudfront-config.json

# 5. Update config with custom domain and SSL (manual edit required)
# Edit cloudfront-config.json to add:
# - Aliases: ["yourdomain.com", "www.yourdomain.com"]
# - ViewerCertificate.ACMCertificateArn: $CERT_ARN
# - ViewerCertificate.SSLSupportMethod: "sni-only"

# 6. Update CloudFront Distribution
aws cloudfront update-distribution \
  --id $DISTRIBUTION_ID \
  --if-match ETAG \
  --distribution-config file://cloudfront-config.json

# 7. Create Route 53 Record (after hosted zone exists)
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch file://route53-changes.json
```

---

## Verification

After setup, verify everything works:

1. **Check SSL Certificate**: Visit `https://yourdomain.com` - should show valid SSL
2. **Check DNS**: Use [dnschecker.org](https://dnschecker.org) to verify DNS propagation
3. **Check CloudFront**: Verify distribution is serving requests
4. **Test Both Domains**: 
   - `https://yourdomain.com`
   - `https://www.yourdomain.com`

---

## Common Issues & Solutions

### Issue: "Certificate validation failed"
**Solution**: Double-check DNS records are correctly added and propagated. Use [whatsmydns.net](https://www.whatsmydns.net) to check.

### Issue: "CNAME already exists"
**Solution**: You might have existing records. Remove or update them first.

### Issue: "Can't use CNAME for root domain"
**Solution**: 
- Use Route 53 ALIAS record (Method 3)
- Or use a DNS provider that supports ALIAS/ANAME
- Or use www subdomain only

### Issue: "CloudFront takes too long to update"
**Solution**: CloudFront deployments take 15-30 minutes. Wait and refresh.

### Issue: "SSL certificate not showing in CloudFront"
**Solution**: 
- Make sure certificate is in **US East (N. Virginia)** region
- Certificate must be **Issued** status
- Wait a few minutes after certificate issuance

---

## Cost Considerations

- **Route 53**: ~$0.50/month per hosted zone + $0.40 per million queries
- **ACM**: Free (SSL certificates are free)
- **CloudFront**: Pay-per-use pricing (no additional cost for custom domain)
- **Domain**: Varies by registrar ($10-15/year typical)

---

## Next Steps After Setup

1. **Set up Redirects**: Redirect HTTP → HTTPS
2. **Set up WWW Redirect**: Redirect `www` → root or vice versa (in CloudFront or Route 53)
3. **Update Environment Variables**: Update your app's API URLs if needed
4. **Update CORS Settings**: Ensure backend allows your new domain
5. **Test Thoroughly**: Test all pages, forms, and API calls

---

## Additional Resources

- [AWS Amplify Domain Management](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html)
- [CloudFront Custom Domains](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html)
- [ACM Certificate Request](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html)
- [Route 53 DNS](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-configuring.html)

---

## Support

If you encounter issues:
1. Check AWS CloudWatch logs
2. Verify DNS propagation status
3. Check CloudFront distribution status
4. Ensure SSL certificate is validated
5. Review AWS service quotas/limits






