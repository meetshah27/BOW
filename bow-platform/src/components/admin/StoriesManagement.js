import React, { useEffect, useState } from 'react';
import { Tag, Edit, Trash2, Plus, Save, X } from 'lucide-react';

const initialForm = {
  title: '',
  author: '',
  authorImage: '',
  image: '',
  content: '',
  tags: '',
};

const StoriesManagement = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch stories
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/stories')
      .then(res => res.json())
      .then(data => {
        setStories(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load stories');
        setLoading(false);
      });
  }, []);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Open add form
  const handleAdd = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(true);
  };

  // Open edit form
  const handleEdit = story => {
    setForm({
      ...story,
      tags: story.tags ? story.tags.join(', ') : '',
    });
    setEditId(story.id);
    setShowForm(true);
  };

  // Save (add or edit)
  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      let res;
      if (editId) {
        res = await fetch(`http://localhost:3000/api/stories/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('http://localhost:3000/api/stories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (res.ok) {
        // Refresh list
        const updated = await fetch('http://localhost:3000/api/stories').then(r => r.json());
        setStories(updated);
        setShowForm(false);
      } else {
        setError('Failed to save story');
      }
    } catch {
      setError('Failed to save story');
    }
    setSaving(false);
  };

  // Delete
  const handleDelete = async id => {
    if (!window.confirm('Delete this story?')) return;
    setSaving(true);
    try {
      await fetch(`http://localhost:3000/api/stories/${id}`, { method: 'DELETE' });
      setStories(stories.filter(s => s.id !== id));
    } catch {
      setError('Failed to delete story');
    }
    setSaving(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stories Management</h2>
        <button className="btn-primary flex items-center" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add New Story
        </button>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Author</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Tags</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.map(story => (
                <tr key={story.id}>
                  <td className="px-4 py-2 border">{story.title}</td>
                  <td className="px-4 py-2 border">{story.author}</td>
                  <td className="px-4 py-2 border">{story.date ? new Date(story.date).toLocaleDateString() : ''}</td>
                  <td className="px-4 py-2 border">
                    {story.tags && story.tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs mr-1 mb-1">
                        <Tag className="w-3 h-3 mr-1" />{tag}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-2 border">
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => handleEdit(story)}><Edit className="w-4 h-4 inline" /></button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(story.id)}><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Add/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative" onSubmit={handleSave}>
            <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={() => setShowForm(false)}>
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">{editId ? 'Edit Story' : 'Add New Story'}</h3>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="input-field" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Author</label>
              <input name="author" value={form.author} onChange={handleChange} className="input-field" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Author Image URL</label>
              <input name="authorImage" value={form.authorImage} onChange={handleChange} className="input-field" />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Story Image URL</label>
              <input name="image" value={form.image} onChange={handleChange} className="input-field" />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Content</label>
              <textarea name="content" value={form.content} onChange={handleChange} className="input-field" rows={6} required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Tags (comma separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange} className="input-field" />
            </div>
            <button type="submit" className="btn-primary flex items-center" disabled={saving}>
              <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save Story'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StoriesManagement; 