const Story = require('./models-dynamodb/Story');

async function seedStories() {
  console.log('🌱 Starting stories seeding...');

  try {
    // Sample stories data
    const sampleStories = [
      {
        title: "How Music Brought Our Community Together",
        author: "Sarah Johnson",
        authorImage: "/assets/authors/sarah-johnson.jpg",
        category: "Community",
        image: "/assets/stories/community-music.jpg",
        excerpt: "When I first moved to Washington, I felt isolated and alone. But everything changed when I discovered Beats of Washington's community music program.",
        content: `
          <p>When I first moved to Washington from California, I felt isolated and alone. The rainy weather and unfamiliar surroundings made it difficult to connect with people. But everything changed when I discovered Beats of Washington's community music program.</p>
          
          <p>I remember walking into my first workshop feeling nervous and unsure. But the moment I picked up a tabla and started learning the rhythms, I felt an immediate connection with the other participants. We were all beginners, all learning together, and the music became our common language.</p>
          
          <p>Over the next few months, I attended weekly sessions where we learned traditional Indian music, modern fusion, and even created our own compositions. The instructors were patient and encouraging, and the other participants became like family.</p>
          
          <p>What started as a simple music class turned into a life-changing experience. I made friends from different backgrounds, learned about diverse cultures through music, and discovered a passion I never knew I had.</p>
          
          <p>Today, I'm proud to be part of the BOW community. I've performed at several events, helped organize workshops for newcomers, and even started teaching basic tabla to children. The music has given me confidence, purpose, and a sense of belonging.</p>
          
          <p>If you're new to the area or feeling disconnected, I encourage you to try one of BOW's programs. You never know how music might change your life.</p>
        `,
        date: "2024-01-15",
        readTime: "8 min read",
        tags: ["community", "music", "newcomer", "friendship"],
        likes: 45,
        comments: 12,
        featured: true
      },
      {
        title: "The Power of Cultural Exchange Through Music",
        author: "Raj Patel",
        authorImage: "/assets/authors/raj-patel.jpg",
        category: "Culture",
        image: "/assets/stories/cultural-exchange.jpg",
        excerpt: "Growing up in a traditional Indian household, I never imagined I'd be teaching Western music to American students while learning their cultural traditions.",
        content: `
          <p>Growing up in a traditional Indian household, I was surrounded by classical Indian music from an early age. My parents insisted I learn tabla and sitar, and while I enjoyed the music, I never imagined it would become a bridge to connect with people from completely different backgrounds.</p>
          
          <p>When I joined Beats of Washington as a volunteer instructor, I expected to teach traditional Indian music to interested students. What I didn't expect was the incredible cultural exchange that would happen.</p>
          
          <p>My students, mostly Americans with no prior exposure to Indian music, were fascinated by the complex rhythms and melodic structures. But what was even more amazing was how they shared their own musical traditions with me.</p>
          
          <p>I learned about jazz, blues, and rock music from my students. We started experimenting with fusion music, combining traditional Indian ragas with Western chord progressions. The results were sometimes surprising, often beautiful, and always educational.</p>
          
          <p>One of my most memorable experiences was when we organized a "Cultural Music Night" where students performed pieces from their own cultural backgrounds. We had everything from Irish folk songs to Korean traditional music, all performed with respect and appreciation for each other's traditions.</p>
          
          <p>Through these experiences, I've come to understand that music is truly a universal language. It can break down barriers, foster understanding, and create connections that transcend cultural differences.</p>
          
          <p>BOW has taught me that cultural exchange isn't about losing your own identity, but about enriching it through understanding and appreciation of others. I'm grateful for the opportunity to be part of this amazing community.</p>
        `,
        date: "2024-02-20",
        readTime: "6 min read",
        tags: ["culture", "fusion", "teaching", "exchange"],
        likes: 38,
        comments: 8,
        featured: false
      },
      {
        title: "From Shy Student to Confident Performer",
        author: "Emily Chen",
        authorImage: "/assets/authors/emily-chen.jpg",
        category: "Personal Growth",
        image: "/assets/stories/personal-growth.jpg",
        excerpt: "I was always the quiet one in class, afraid to speak up or perform. BOW's supportive environment helped me find my voice and confidence.",
        content: `
          <p>I was always the quiet one in class, the student who sat in the back and never raised my hand. I loved music but was terrified of performing in front of others. Even the thought of singing in a group made my heart race.</p>
          
          <p>When my friend convinced me to join a BOW vocal workshop, I was nervous but excited. The instructor, Aand, immediately put me at ease with his warm personality and encouraging approach. He emphasized that there was no judgment, no pressure to be perfect.</p>
          
          <p>The first few sessions were challenging. My voice would shake, and I could barely make a sound. But the other participants were so supportive, cheering me on and sharing their own struggles with performance anxiety.</p>
          
          <p>Gradually, I started to feel more comfortable. I learned breathing techniques, vocal exercises, and most importantly, how to trust my voice. The instructors taught us that music is about expression, not perfection.</p>
          
          <p>Six months after joining, I performed my first solo piece at a BOW community concert. My hands were shaking, but I made it through the entire song. The applause and encouragement from the audience was overwhelming.</p>
          
          <p>Today, I'm a regular performer at BOW events and even help lead vocal workshops for newcomers. I've learned that confidence comes from practice, support, and believing in yourself.</p>
          
          <p>If you're struggling with confidence or performance anxiety, I encourage you to try BOW's programs. The supportive environment and encouraging instructors can help you discover strengths you never knew you had.</p>
        `,
        date: "2024-03-10",
        readTime: "7 min read",
        tags: ["confidence", "performance", "vocal", "growth"],
        likes: 52,
        comments: 15,
        featured: true
      },
      {
        title: "Building Bridges Through Music Education",
        author: "Dr. Maria Rodriguez",
        authorImage: "/assets/authors/maria-rodriguez.jpg",
        category: "Education",
        image: "/assets/stories/music-education.jpg",
        excerpt: "As an educator, I've seen firsthand how music can transform learning environments and help students develop essential life skills.",
        content: `
          <p>As an educator with over 15 years of experience, I've always believed in the power of music to enhance learning and development. When I discovered Beats of Washington's educational programs, I was excited to see how they could benefit my students.</p>
          
          <p>I started by incorporating BOW's music workshops into my classroom curriculum. The results were immediate and remarkable. Students who struggled with focus and attention became engaged and participatory during music sessions.</p>
          
          <p>One of my most challenging students, a 10-year-old boy with ADHD, found his rhythm literally and figuratively through drumming workshops. The structured, repetitive nature of drumming helped him develop concentration and self-control.</p>
          
          <p>I also noticed that music helped bridge language barriers in my diverse classroom. Students who spoke different languages could communicate through music, creating a sense of unity and understanding.</p>
          
          <p>BOW's programs taught my students valuable life skills: teamwork, discipline, creativity, and cultural appreciation. They learned to listen to each other, respect different perspectives, and work together to create something beautiful.</p>
          
          <p>I've since become a strong advocate for music education in schools. The benefits extend far beyond musical skills – they include improved academic performance, better social skills, and enhanced emotional intelligence.</p>
          
          <p>I'm grateful to BOW for providing these opportunities and for their commitment to making music education accessible to all children, regardless of their background or circumstances.</p>
        `,
        date: "2024-01-28",
        readTime: "9 min read",
        tags: ["education", "children", "learning", "development"],
        likes: 41,
        comments: 11,
        featured: false
      },
      {
        title: "Finding Purpose Through Volunteer Work",
        author: "Michael Thompson",
        authorImage: "/assets/authors/michael-thompson.jpg",
        category: "Volunteering",
        image: "/assets/stories/volunteer-work.jpg",
        excerpt: "After retiring from my corporate job, I felt lost and purposeless. Volunteering with BOW gave me a new sense of meaning and community.",
        content: `
          <p>After 30 years in the corporate world, I retired feeling accomplished but also somewhat lost. The daily routine that had defined my life for decades was suddenly gone, and I wasn't sure what to do with myself.</p>
          
          <p>I discovered Beats of Washington through a community event and was immediately drawn to their mission of bringing people together through music. I decided to volunteer, thinking it would be a good way to stay busy and give back to the community.</p>
          
          <p>What I didn't expect was how much I would learn and grow through this experience. I started by helping with event setup and logistics, but soon found myself learning about different musical traditions and cultures.</p>
          
          <p>I discovered a passion for event planning and community organization. I helped coordinate workshops, manage volunteer schedules, and organize fundraising events. The skills I developed in my corporate career – project management, team leadership, and strategic planning – were now being used to serve the community.</p>
          
          <p>Most importantly, I found a new sense of purpose. Instead of just staying busy, I was making a real difference in people's lives. I saw how music brought joy to children, comfort to seniors, and connection to isolated individuals.</p>
          
          <p>Today, I'm a board member of BOW and lead several community initiatives. I've found that retirement isn't about stopping – it's about redirecting your energy and experience toward something meaningful.</p>
          
          <p>If you're looking for purpose or want to make a difference in your community, I encourage you to get involved with BOW. There are opportunities for people of all ages and backgrounds to contribute and grow.</p>
        `,
        date: "2024-02-15",
        readTime: "8 min read",
        tags: ["volunteering", "retirement", "purpose", "community"],
        likes: 35,
        comments: 9,
        featured: false
      }
    ];

    // Create stories
    for (const storyData of sampleStories) {
      try {
        await Story.create(storyData);
        console.log(`✅ Created story: ${storyData.title}`);
      } catch (error) {
        console.log(`ℹ️  Story ${storyData.title} might already exist`);
      }
    }

    console.log('🎉 Stories seeding completed successfully!');
    console.log(`📊 Created ${sampleStories.length} sample stories`);

  } catch (error) {
    console.error('❌ Stories seeding error:', error);
  }
}

// Run seeding
seedStories(); 