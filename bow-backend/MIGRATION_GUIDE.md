# DynamoDB Migration Guide: us-east-2 to us-west-2

This guide will help you migrate your DynamoDB tables from `us-east-2` to `us-west-2` (Oregon).

## Prerequisites ✅

1. **AWS Credentials**: Ensure your AWS credentials have access to both regions
2. **Backup**: Your data is already backed up (the migration script will create a backup)
3. **New Region Setup**: You've already set up the new region and S3

## Migration Steps 🚀

### Step 1: Run the Migration Script

```bash
cd bow-backend
node migrate-dynamodb.js
```

This script will:
- Create all tables in `us-west-2` with the same schema
- Export all data from `us-east-2`
- Import all data to `us-west-2`
- Handle rate limiting and batch operations

### Step 2: Update Backend Configuration

```bash
node update-config-after-migration.js
```

This will update your DynamoDB configuration to use `us-west-2`.

### Step 3: Manual Configuration Updates

#### Update Environment Variables
In your `.env` file:
```env
AWS_REGION=us-west-2
```

#### Update Frontend Amplify Configuration
In `bow-platform/src/config/amplify.js`:
```javascript
Amplify.configure({
  Auth: {
    region: 'us-west-2', // Change from 'us-east-1'
    userPoolId: 'us-west-2_YOUR_NEW_USER_POOL_ID', // Update this
    userPoolWebClientId: 'YOUR_NEW_CLIENT_ID', // Update this
    oauth: {
      domain: 'us-west-2-YOUR_NEW_DOMAIN.auth.us-west-2.amazoncognito.com', // Update this
      // ... rest of config
    }
  }
});
```

### Step 4: Test Your Application

1. **Start your backend server**:
   ```bash
   cd bow-backend
   npm start
   ```

2. **Start your frontend**:
   ```bash
   cd bow-platform
   npm start
   ```

3. **Test all functionality**:
   - User registration/login
   - Event creation and management
   - Story creation and management
   - Donation processing
   - Volunteer applications
   - Gallery uploads
   - All CRUD operations

### Step 5: Update Deployment Configuration

If you're using a deployment platform (Vercel, Netlify, etc.), update the environment variables:

- `AWS_REGION=us-west-2`
- Any other region-specific variables

### Step 6: Clean Up (After Confirming Everything Works)

Once you've confirmed everything works correctly:

1. **Delete old tables in us-east-2** (optional)
2. **Update any documentation** that references the old region
3. **Monitor your application** for any issues

## What Gets Migrated 📦

The migration script will migrate all these tables:

- `bow-users` - User accounts and profiles
- `bow-events` - Event information
- `bow-stories` - Community stories
- `bow-founders` - Founder information
- `bow-donations` - Donation records
- `bow-registrations` - Event registrations
- `bow-volunteers` - Volunteer applications
- `bow-gallery` - Gallery images and metadata

## Troubleshooting 🔧

### Common Issues

1. **Permission Denied**
   - Ensure your AWS credentials have DynamoDB permissions in both regions
   - Check IAM roles and policies

2. **Table Already Exists**
   - The script will skip existing tables
   - You can manually delete tables in the destination region if needed

3. **Rate Limiting**
   - The script includes built-in rate limiting
   - If you encounter throttling, increase the sleep duration

4. **Data Inconsistency**
   - Run the migration during low-traffic periods
   - Consider stopping your application during migration

### Rollback Plan

If something goes wrong:

1. **Keep your old tables** in `us-east-2` until you're confident
2. **Update configuration** back to `us-east-2`
3. **Restart your application** with the old region
4. **Investigate the issue** and try again

## Performance Considerations ⚡

- **Latency**: Oregon (`us-west-2`) might have different latency for your users
- **Costs**: DynamoDB pricing is the same across regions
- **Availability**: Both regions have the same SLA

## Security Notes 🔒

- **IAM Roles**: Update any IAM roles that are region-specific
- **VPC**: If using VPC, ensure it's configured for the new region
- **Encryption**: DynamoDB encryption settings will be preserved

## Monitoring 📊

After migration:

1. **Monitor application performance**
2. **Check error logs**
3. **Verify all functionality works**
4. **Monitor DynamoDB metrics** in the new region

## Support 🆘

If you encounter issues:

1. Check AWS CloudWatch logs
2. Verify your AWS credentials and permissions
3. Test with a small subset of data first
4. Consider running the migration in stages

---

**Remember**: Always test thoroughly before deleting old resources! 