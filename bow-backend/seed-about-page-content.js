const AboutPage = require('./models-dynamodb/AboutPage');
const FounderContent = require('./models-dynamodb/FounderContent');

async function seedAboutPageContent() {
  try {
    console.log('🌱 Seeding About Page content...');
    
    // Create About Page settings
    const aboutPage = new AboutPage({
      storyTitle: 'Our Story',
      storySubtitle: 'From humble beginnings to a statewide movement, here\'s how BOW has grown and evolved over the years.',
      foundingYear: '2019',
      foundingTitle: 'Founded in 2019',
      foundingDescription: 'Beats of Washington was founded by Aand Sane and Deepali Sane, visionary community leaders who recognized the power of music to bring people together. What started as a small neighborhood drum circle has grown into one of Washington State\'s most impactful community organizations.',
      founderBelief: 'Our founders believed that music transcends barriers of language, culture, and background, creating opportunities for genuine connection and understanding between diverse communities.',
      todayVision: 'Today, we continue to honor that vision while adapting to meet the evolving needs of our communities through innovative programming and partnerships.',
      achievements: [
        {
          year: '2019',
          title: 'Foundation Established',
          description: 'BOW was founded with a vision of community building through music.'
        },
        {
          year: '2020',
          title: 'First Community Event',
          description: 'Successfully organized our first major community music festival.'
        },
        {
          year: '2021',
          title: 'Statewide Expansion',
          description: 'Extended programs to multiple cities across Washington State.'
        },
        {
          year: '2022',
          title: 'Cultural Partnerships',
          description: 'Formed partnerships with diverse cultural organizations.'
        },
        {
          year: '2023',
          title: 'Digital Innovation',
          description: 'Launched online programs and virtual community events.'
        },
        {
          year: '2024',
          title: 'Community Impact',
          description: 'Reached over 50,000 community members across the state.'
        }
      ],
      isActive: true
    });
    
    await aboutPage.save();
    console.log('✅ About Page content seeded successfully!');
    
    // Create Founder Content settings
    const founderContent = new FounderContent({
      sectionTitle: 'Our Founders',
      sectionSubtitle: 'Meet the visionary leaders who founded Beats of Washington and continue to guide our mission of empowering communities through music.',
      aandSane: {
        name: 'Aand Sane',
        role: 'Board Chair & Co-Founder',
        partnership: 'Partnering with Deepali Sane',
        description: 'Aand Sane & Deepali Sane are the visionary co-founders of Beats of Washington, whose shared passion for community building through music has inspired thousands across Washington State. As Board Chair, Aand continues to lead our organization with dedication and innovative thinking, working closely with Deepali to guide our mission together.',
        traits: ['Visionary Leader', 'Community Builder'],
        avatar: 'A',
        isActive: true
      },
      deepaliSane: {
        name: 'Deepali Sane',
        role: 'Co-Founder & Strategic Director',
        description: 'Deepali Sane brings her strategic vision and cultural expertise to BOW, working alongside Aand to create meaningful community connections through music and cultural exchange.',
        traits: ['Strategic Vision', 'Cultural Expert'],
        isActive: true
      },
      isActive: true
    });
    
    await founderContent.save();
    console.log('✅ Founder Content seeded successfully!');
    
    console.log('\n🎉 All content seeded successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Check the admin panel for new management options');
    console.log('   2. Test editing the content');
    console.log('   3. Verify changes appear on the About page');
    
  } catch (error) {
    console.error('❌ Error seeding content:', error);
  }
}

// Run the seed function
seedAboutPageContent();
