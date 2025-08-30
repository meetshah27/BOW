import React, { useState, useEffect } from "react";
import { Heart, Users, Star, Music, BookOpen, Play, Image as ImageIcon, Video as VideoIcon, FileText, Upload } from "lucide-react";
import api from "../config/api";
import "../App.css";
import HeroSection from "../components/common/HeroSection"; // Added import for HeroSection

const StoriesPage = () => {
  const [storiesMedia, setStoriesMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');

  // Fetch logo from about page content
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/about-page');
        if (response.ok) {
          const data = await response.json();
          setLogoUrl(data.logo || '');
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    fetchLogo();
  }, []);

  // Fetch stories media from backend
  useEffect(() => {
    const fetchStoriesMedia = async () => {
      try {
        setLoading(true);
        const response = await api.get('/stories-media');
        if (response.ok) {
          const data = await response.json();
          setStoriesMedia(data);
        } else {
          // If no media found, that's okay - we'll show placeholder
          setStoriesMedia(null);
        }
      } catch (err) {
        console.error('Error fetching stories media:', err);
        setStoriesMedia(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStoriesMedia();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading stories page...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection
        title={storiesMedia?.storiesTitle || 'Community Stories'}
        description={storiesMedia?.storiesDescription || 'Discover the inspiring journeys of individuals whose lives have been touched by Beats of Washington. Each story reflects the impact of our community and the power of coming together.'}
        subtitle={storiesMedia?.storiesSubtitle}
        badge="📖 Inspiring Stories 📖"
        logoUrl={logoUrl}
        showLogo={true}
        floatingElements={[
          { icon: Heart, position: 'top-6 left-6', animation: 'animate-float-slow' },
          { icon: Users, position: 'top-16 right-20', animation: 'animate-float-slow-reverse' },
          { icon: Star, position: 'bottom-16 left-20', animation: 'animate-float-slow' },
          { icon: Music, position: 'bottom-20 right-6', animation: 'animate-float-slow-reverse' },
          { icon: BookOpen, position: 'top-1/3 left-1/3', animation: 'animate-float-slow' },
          { icon: Play, position: 'top-2/3 right-1/3', animation: 'animate-float-slow-reverse' }
        ]}
        interactiveElements={[
          { icon: Heart, label: 'Stories', color: 'text-red-300' },
          { icon: Users, label: 'Community', color: 'text-blue-300' },
          { icon: Music, label: 'Impact', color: 'text-purple-300' }
        ]}
      />

      {/* Stories Content */}
             {/* Media Placeholder Section */}
       <section className="container-custom py-8">
         {storiesMedia?.mediaUrl ? (
           // Display uploaded media with effects
           <div className="relative">
                                         {/* Media Container with Effects */}
               <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg border border-gray-200 p-6 max-w-4xl mx-auto">
                {/* Media Display */}
                <div className="relative">
                                     {storiesMedia.mediaType === 'video' ? (
                     <div className="relative w-full">
                       <video 
                         className="w-full h-auto object-contain max-h-96 transition-all duration-500 ease-in-out hover:max-h-[32rem] focus:max-h-[32rem]"
                         poster={storiesMedia.thumbnailUrl || '/assets/video-placeholder.jpg'}
                         controls
                         preload="metadata"
                         autoPlay={true}
                         muted
                         loop
                       >
                         <source src={storiesMedia.mediaUrl} type="video/mp4" />
                         Your browser does not support the video tag.
                       </video>
                       
                       {/* Video Overlay Effects */}
                       <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                         <VideoIcon className="w-4 h-4 inline mr-1" />
                         Video
                       </div>
                     </div>
                  ) : (
                    <div className="relative w-full">
                      <img 
                        src={storiesMedia.mediaUrl} 
                        alt={storiesMedia.altText || 'Stories media'}
                        className="w-full h-auto object-contain max-h-96"
                      />
                      
                      {/* Image Overlay Effects */}
                      <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                        <ImageIcon className="w-4 h-4 inline mr-1" />
                        Image
                      </div>
                    </div>
                  )}
                </div>

               {/* Content Overlay */}
               {(storiesMedia.title || storiesMedia.description) && (
                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                   {storiesMedia.title && (
                     <h2 className="text-lg font-bold mb-2 drop-shadow-lg">
                       {storiesMedia.title}
                     </h2>
                   )}
                   {storiesMedia.description && (
                     <p className="text-sm text-gray-200 drop-shadow leading-relaxed max-w-md">
                       {storiesMedia.description}
                     </p>
                   )}
                 </div>
               )}
             </div>

             {/* Floating Elements Around Media */}
             <div className="absolute -top-3 -left-3 w-12 h-12 bg-primary-200 rounded-full opacity-60 animate-pulse"></div>
             <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-secondary-200 rounded-full opacity-60 animate-pulse" style={{animationDelay: '1s'}}></div>
             <div className="absolute top-1/2 -right-4 w-8 h-8 bg-yellow-200 rounded-full opacity-60 animate-pulse" style={{animationDelay: '2s'}}></div>
           </div>
         ) : (
           // Beautiful Media Placeholder with Effects
           <div className="relative">
             {/* Main Placeholder Container */}
             <div className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-xl shadow-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary-400 transition-all duration-500 group w-full max-w-2xl mx-auto">
               {/* Animated Background Pattern */}
               <div className="absolute inset-0 opacity-15">
                 <div className="absolute inset-0 bg-gradient-to-r from-primary-100 via-transparent to-secondary-100 animate-pulse"></div>
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse" style={{animationDelay: '1s'}}></div>
               </div>

               {/* Floating Background Elements - Inside Container */}
               <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-200 to-transparent rounded-full opacity-40 animate-pulse"></div>
               <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-secondary-200 to-transparent rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
               <div className="absolute top-1/2 -right-6 w-8 h-8 bg-gradient-to-br from-yellow-200 to-transparent rounded-full opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>

               {/* Placeholder Content */}
               <div className="relative z-10 p-8 text-center h-48 flex flex-col items-center justify-center">
                 {/* Icon with Animation */}
                 <div className="relative mb-4">
                   <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                     <BookOpen className="w-10 h-10 text-primary-600 group-hover:text-primary-700 transition-colors" />
                   </div>
                   
                   {/* Floating Elements Around Icon */}
                   <div className="absolute -top-2 -left-2 w-3 h-3 bg-yellow-300 rounded-full opacity-70 animate-bounce"></div>
                   <div className="absolute -top-2 -right-2 w-2.5 h-2.5 bg-blue-300 rounded-full opacity-70 animate-bounce" style={{animationDelay: '0.5s'}}></div>
                   <div className="absolute -bottom-2 -left-2 w-2.5 h-2.5 bg-green-300 rounded-full opacity-70 animate-bounce" style={{animationDelay: '1s'}}></div>
                   <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-purple-300 rounded-full opacity-70 animate-bounce" style={{animationDelay: '1.5s'}}></div>
                 </div>

                 {/* Text Content */}
                 <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors">
                   Stories Media Placeholder
                 </h2>
                 
                 <p className="text-base text-gray-600 mb-3 max-w-md mx-auto leading-relaxed">
                   Upload an image or video through the admin panel to showcase your community stories
                 </p>

                 {/* Decorative Elements */}
                 <div className="mt-3 flex justify-center space-x-2">
                   <div className="w-2 h-2 bg-primary-400 rounded-full animate-ping"></div>
                   <div className="w-2 h-2 bg-secondary-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                   <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                 </div>
               </div>

               {/* Animated Border Effect */}
               <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
             </div>
           </div>
         )}
       </section>

      {/* Bottom Spacing */}
      <div className="h-16"></div>
    </div>
  );
};

export default StoriesPage; 