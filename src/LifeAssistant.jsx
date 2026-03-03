import React, { useState, useEffect } from 'react';
import { Plus, Send, Sparkles, X, ChevronRight, Clock, Tag, Calendar, Search } from 'lucide-react';

const LifeAssistant = () => {
  const [notes, setNotes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Home');
  const [quickCapture, setQuickCapture] = useState('');
  const [quickDueDate, setQuickDueDate] = useState('');
  const [quickTags, setQuickTags] = useState('');
  const [aiPanel, setAiPanel] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allTags, setAllTags] = useState([]);

  const categories = ['Home', 'Work', 'School', 'Personal'];

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lifeAssistantNotes');
    if (saved) {
      const loadedNotes = JSON.parse(saved);
      setNotes(loadedNotes);
      // Extract all unique tags
      const tags = new Set();
      loadedNotes.forEach(note => {
        note.tags?.forEach(tag => tags.add(tag));
      });
      setAllTags(Array.from(tags));
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('lifeAssistantNotes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (text, category, dueDate = '', tags = []) => {
    if (!text.trim()) return;
    const newNote = {
      id: Date.now(),
      text,
      category,
      dueDate,
      tags,
      timestamp: new Date().toLocaleString(),
    };
    setNotes([newNote, ...notes]);
    
    // Update allTags
    tags.forEach(tag => {
      if (!allTags.includes(tag)) {
        setAllTags([...allTags, tag]);
      }
    });
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleQuickCapture = () => {
    const tags = quickTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t);
    addNote(quickCapture, activeCategory, quickDueDate, tags);
    setQuickCapture('');
    setQuickDueDate('');
    setQuickTags('');
  };

  // Filter and search notes
  const getFilteredNotes = () => {
    let filtered = notes.filter(n => n.category === activeCategory);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.text.toLowerCase().includes(query) ||
        n.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  // Format due date for display
  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Check if due date is overdue
  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date() && new Date(dateStr).toDateString() !== new Date().toDateString();
  };

  const handleAiAssist = async () => {
    if (!aiPanel.trim()) return;
    setAiLoading(true);
    setAiResponse('');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: `You are a helpful life assistant. Your job is to help the user clarify, organize, and refine their thoughts and notes. 
When the user shares a messy thought or idea, help them:
1. Clarify what they're really trying to say
2. Break it into actionable items if it's complex
3. Suggest how it might fit into their life categories (Home, Work, School, Personal)

Be concise, practical, and encouraging. Keep responses short and scannable.`,
          messages: [
            { role: 'user', content: aiPanel }
          ],
        }),
      });

      const data = await response.json();
      const text = data.content[0]?.text || 'No response received';
      setAiResponse(text);
    } catch (error) {
      setAiResponse('Error connecting to AI. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const categoryNotes = notes.filter(n => n.category === activeCategory);
  const lastNote = categoryNotes[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Life Assistant
            </h1>
          </div>
          <p className="text-slate-400">Capture your thoughts, manage your life</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Capture */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
              <div className="flex gap-3 mb-4">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <textarea
                value={quickCapture}
                onChange={(e) => setQuickCapture(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleQuickCapture();
                  }
                }}
                placeholder={`Quick thought for ${activeCategory}...`}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mb-3"
                rows="3"
              />

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={quickDueDate}
                    onChange={(e) => setQuickDueDate(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={quickTags}
                    onChange={(e) => setQuickTags(e.target.value)}
                    placeholder="urgent, important, follow-up"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-2 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleQuickCapture}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Note
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">Ctrl+Enter to submit</p>
            </div>

            {/* Last Note in Category */}
            {lastNote && (
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-700/50 p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-semibold text-cyan-300">Last {activeCategory} Note</h3>
                </div>
                <p className="text-slate-200 mb-3">{lastNote.text}</p>
                {lastNote.tags && lastNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {lastNote.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-cyan-900/40 text-cyan-300 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                {lastNote.dueDate && (
                  <p className="text-xs text-cyan-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Due: {formatDueDate(lastNote.dueDate)}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-2">{lastNote.timestamp}</p>
              </div>
            )}

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes or tags..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Notes List */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-200">
                {searchQuery ? 'Search Results' : `All ${activeCategory} Notes`} ({getFilteredNotes().length})
              </h3>
              <div className="space-y-3">
                {getFilteredNotes().length === 0 ? (
                  <p className="text-slate-400 text-center py-8">
                    {searchQuery ? 'No results found.' : 'No notes yet. Start capturing your thoughts!'}
                  </p>
                ) : (
                  getFilteredNotes().map(note => (
                    <div
                      key={note.id}
                      className={`border rounded-lg p-4 transition-colors group ${
                        isOverdue(note.dueDate)
                          ? 'bg-red-900/20 border-red-600/50 hover:bg-red-900/30'
                          : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <p className="text-slate-100 flex-1">{note.text}</p>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Tags */}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {note.tags.map((tag, i) => (
                            <span key={i} className="text-xs bg-slate-600/50 text-slate-300 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Due Date and Timestamp */}
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>{note.timestamp}</span>
                        {note.dueDate && (
                          <span className={isOverdue(note.dueDate) ? 'text-red-400 font-semibold flex items-center gap-1' : 'flex items-center gap-1'}>
                            <Calendar className="w-3 h-3" />
                            {formatDueDate(note.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* AI Assistant Panel */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>

              {!showAiPanel ? (
                <button
                  onClick={() => setShowAiPanel(true)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Clarify a Thought
                </button>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={aiPanel}
                    onChange={(e) => setAiPanel(e.target.value)}
                    placeholder="Share your messy thought, idea, or question..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows="4"
                  />

                  <button
                    onClick={handleAiAssist}
                    disabled={aiLoading || !aiPanel.trim()}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {aiLoading ? 'Thinking...' : 'Get Help'}
                  </button>

                  {aiResponse && (
                    <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4 mt-4">
                      <p className="text-sm text-amber-50 whitespace-pre-wrap">{aiResponse}</p>
                      <button
                        onClick={() => {
                          setAiPanel('');
                          setAiResponse('');
                        }}
                        className="mt-3 text-xs text-amber-300 hover:text-amber-200 transition-colors"
                      >
                        Clear & Ask Another
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setShowAiPanel(false);
                      setAiPanel('');
                      setAiResponse('');
                    }}
                    className="w-full text-slate-400 hover:text-slate-300 py-2 text-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Quick Tips */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-xs font-semibold text-slate-400 mb-3">TIPS</p>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex gap-2">
                    <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-slate-600" />
                    Use AI to clarify half-formed ideas
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-slate-600" />
                    Switch categories anytime to jump contexts
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-slate-600" />
                    Your notes save automatically
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeAssistant;
