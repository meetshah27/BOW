import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Tag, ArrowLeft } from 'lucide-react';
import api from '../config/api';

const FALLBACK_STORY = {
  id: '',
  title: 'Story Not Found',
  author: 'Unknown',
  authorImage: '',
  date: '',
  image: '',
  content: 'Sorry, we could not find this story.',
  tags: [],
};

const StoryDetailsPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/stories/${id}`)
      .then(res => res.ok ? res.json() : Promise.resolve(FALLBACK_STORY))
      .then(data => {
        setStory(data);
        setLoading(false);
      })
      .catch(() => {
        setStory(FALLBACK_STORY);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!story) return null;

  return (
    <>
      <Helmet>
        <title>{story.title} - Story Details</title>
      </Helmet>
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-12">
        <div className="container-custom flex flex-col md:flex-row items-center gap-8">
          <Link to="/stories" className="mb-6 md:mb-0 flex items-center text-white hover:text-secondary-200">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Stories
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold flex-1 text-center md:text-left">{story.title}</h1>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="mb-8">
            <img
              src={story.image || '/assets/default-story.jpg'}
              alt={story.title}
              className="w-full h-64 object-cover rounded-xl shadow-lg mb-4 bg-gray-100"
              onError={e => { e.target.src = '/assets/default-story.jpg'; }}
            />
            <div className="flex items-center mb-4">
              <img
                src={story.authorImage || '/assets/default-author.jpg'}
                alt={story.author}
                className="w-12 h-12 rounded-full mr-4 object-cover bg-gray-100"
                onError={e => { e.target.src = '/assets/default-author.jpg'; }}
              />
              <div>
                <h4 className="font-semibold text-gray-900">{story.author}</h4>
                <p className="text-sm text-gray-600">{story.date ? new Date(story.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
              </div>
            </div>
          </div>
          <div className="prose max-w-none mb-8 text-gray-800">
            {story.content?.split('\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {story.tags.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default StoryDetailsPage; 