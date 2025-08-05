require('dotenv').config();
const VolunteerOpportunity = require('./models-dynamodb/VolunteerOpportunity');

const initialOpportunities = [
  {
    title: "Event Coordinator",
    category: "Events",
    location: "Seattle Area",
    timeCommitment: "4-8 hours per event",
    description: "Help plan and coordinate community events, from small workshops to large festivals.",
    requirements: [
      "Strong organizational skills",
      "Experience with event planning preferred",
      "Available on weekends",
      "Passion for community building"
    ],
    benefits: [
      "Gain event management experience",
      "Network with community leaders",
      "Free access to BOW events",
      "Recognition and appreciation"
    ],
    maxVolunteers: 5
  },
  {
    title: "Music Workshop Assistant",
    category: "Education",
    location: "Various Locations",
    timeCommitment: "2-4 hours per week",
    description: "Support music education programs for youth and adults in our community.",
    requirements: [
      "Basic music knowledge",
      "Patience working with diverse groups",
      "Background check required",
      "Reliable transportation"
    ],
    benefits: [
      "Teaching experience",
      "Music education training",
      "Work with inspiring youth",
      "Flexible scheduling"
    ],
    maxVolunteers: 8
  },
  {
    title: "Community Outreach Specialist",
    category: "Outreach",
    location: "Washington State",
    timeCommitment: "3-6 hours per week",
    description: "Help spread the word about BOW programs and build partnerships with local organizations.",
    requirements: [
      "Excellent communication skills",
      "Knowledge of local community",
      "Social media experience",
      "Self-motivated"
    ],
    benefits: [
      "Networking opportunities",
      "Marketing experience",
      "Community connections",
      "Professional development"
    ],
    maxVolunteers: 3
  },
  {
    title: "Technical Support",
    category: "Technical",
    location: "Remote/Seattle",
    timeCommitment: "2-5 hours per week",
    description: "Provide technical support for our website, social media, and digital platforms.",
    requirements: [
      "Basic web development skills",
      "Social media management",
      "Problem-solving abilities",
      "Reliable internet connection"
    ],
    benefits: [
      "Tech experience",
      "Portfolio building",
      "Remote work opportunity",
      "Skill development"
    ],
    maxVolunteers: 4
  },
  {
    title: "LED Light Setup Coordinator",
    category: "Technical",
    location: "Seattle Area",
    timeCommitment: "3-6 hours per event",
    description: "Help set up and manage LED lighting systems for our events and performances.",
    requirements: [
      "Experience with LED lighting systems",
      "Basic electrical knowledge",
      "Available for evening events",
      "Attention to detail"
    ],
    benefits: [
      "Technical lighting experience",
      "Event production skills",
      "Creative expression",
      "Professional networking"
    ],
    maxVolunteers: 2
  },
  {
    title: "Fundraising Coordinator",
    category: "Fundraising",
    location: "Washington State",
    timeCommitment: "5-10 hours per week",
    description: "Help organize fundraising campaigns and donor engagement activities.",
    requirements: [
      "Strong communication skills",
      "Experience with fundraising preferred",
      "Organized and detail-oriented",
      "Passion for community causes"
    ],
    benefits: [
      "Fundraising experience",
      "Donor relationship skills",
      "Non-profit sector exposure",
      "Leadership development"
    ],
    maxVolunteers: 3
  }
];

async function seedVolunteerOpportunities() {
  try {
    console.log('🌱 Seeding volunteer opportunities...');
    
    let createdCount = 0;
    let skippedCount = 0;

    for (const opportunityData of initialOpportunities) {
      try {
        // Check if opportunity with same title already exists
        const existingOpportunities = await VolunteerOpportunity.getAllOpportunities();
        const exists = existingOpportunities.some(opp => 
          opp.title.toLowerCase() === opportunityData.title.toLowerCase()
        );

        if (exists) {
          console.log(`⏭️  Skipping "${opportunityData.title}" - already exists`);
          skippedCount++;
          continue;
        }

        const opportunity = await VolunteerOpportunity.create(opportunityData);
        console.log(`✅ Created: ${opportunity.title}`);
        createdCount++;
      } catch (error) {
        console.error(`❌ Error creating "${opportunityData.title}":`, error.message);
      }
    }

    console.log('\n🎉 Seeding completed!');
    console.log(`📊 Created: ${createdCount} opportunities`);
    console.log(`⏭️  Skipped: ${skippedCount} opportunities (already exist)`);
    
    // Show final count
    const allOpportunities = await VolunteerOpportunity.getAllOpportunities();
    console.log(`📈 Total opportunities in database: ${allOpportunities.length}`);

  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  seedVolunteerOpportunities()
    .then(() => {
      console.log('\n✨ Volunteer opportunities seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedVolunteerOpportunities }; 