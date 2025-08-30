const { Donation } = require('./models-dynamodb/Donation');

async function cleanupPendingDonations() {
  try {
    console.log('🧹 Starting cleanup of pending donations...');
    
    // Get all donations
    const result = await Donation.findAll({ limit: 1000 });
    const pendingDonations = result.donations.filter(d => d.status === 'pending');
    
    console.log(`📊 Found ${pendingDonations.length} pending donations`);
    
    if (pendingDonations.length === 0) {
      console.log('✅ No pending donations to clean up');
      return;
    }
    
    // Delete pending donations
    let deletedCount = 0;
    for (const donation of pendingDonations) {
      try {
        await Donation.deleteByPaymentIntentId(donation.paymentIntentId);
        deletedCount++;
        console.log(`🗑️  Deleted pending donation: ${donation.paymentIntentId} (${donation.donorEmail})`);
      } catch (error) {
        console.error(`❌ Error deleting donation ${donation.paymentIntentId}:`, error.message);
      }
    }
    
    console.log(`✅ Cleanup completed: ${deletedCount} pending donations deleted`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run cleanup if this script is executed directly
if (require.main === module) {
  cleanupPendingDonations()
    .then(() => {
      console.log('🏁 Cleanup script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Cleanup script failed:', error);
      process.exit(1);
    });
}

module.exports = { cleanupPendingDonations };
