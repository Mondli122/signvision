import React, { useState, useEffect } from 'react';
import { Users, Plus, Upload, Heart, MapPin, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from '../utils/toast';

export default function CommunitySubmissions() {
  const [signs, setSigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [word, setWord] = useState('');
  const [gloss, setGloss] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [category, setCategory] = useState('Local Slang / Idiom');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/community-signs')
      .then(res => res.json())
      .then(data => {
        if (data && data.signs) setSigns(data.signs);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word || !description) {
      toast.warning('Please provide a word and description for your sign submission', 'Missing Fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/community-signs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          gloss: gloss || word.toUpperCase(),
          province,
          category,
          description,
          author: author || 'Community Contributor'
        })
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.sign) {
        setSigns(prev => [data.sign, ...prev]);
        toast.success('Your sign submission has been added to the SASL community repository!', 'Submission Received');
        setWord('');
        setGloss('');
        setDescription('');
        setShowForm(false);
      }
    } catch (err) {
      setIsSubmitting(false);
      toast.error('Could not submit sign. Please try again.', 'Error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
          border: '1px solid rgba(236, 72, 153, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#FCE7F3', color: '#DB2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
              Crowdsourced SASL Community Repository
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Contribute regional South African colloquial signs, youth slang, and provincial dialect variants
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', fontSize: '13px' }}
        >
          <Plus size={16} /> {showForm ? 'Close Submission Form' : 'Contribute a Regional Sign'}
        </button>
      </div>

      {/* Submission Form Modal/Panel */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
            Submit a New SASL Sign
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>English / Local Word</label>
              <input
                type="text"
                value={word}
                onChange={e => setWord(e.target.value)}
                placeholder="e.g. Braai, Lekker, Ubuntu..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-card-subtle)', color: 'var(--text-main)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Province / Region</label>
              <select
                value={province}
                onChange={e => setProvince(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-card-subtle)', color: 'var(--text-main)', fontSize: '13px' }}
              >
                <option value="Gauteng">Gauteng</option>
                <option value="Western Cape">Western Cape</option>
                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                <option value="Eastern Cape">Eastern Cape</option>
                <option value="Free State">Free State</option>
                <option value="Limpopo">Limpopo</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Handshape & Movement Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the hand shape, orientation, facial gesture, and motion trajectory..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-card-subtle)', color: 'var(--text-main)', fontSize: '13px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Your Name or School / Hub</label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="e.g. Thabo (UL Digital Hub)"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-card-subtle)', color: 'var(--text-main)', fontSize: '13px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: '100%', padding: '11px', borderRadius: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <CheckCircle size={16} /> {isSubmitting ? 'Submitting...' : 'Post Sign to Community'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Community Signs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {isLoading ? (
          [1, 2, 3, 4].map(n => (
            <div key={n} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="skeleton-shimmer" style={{ width: '120px', height: '22px' }} />
                <div className="skeleton-shimmer" style={{ width: '70px', height: '18px', borderRadius: '8px' }} />
              </div>
              <div className="skeleton-shimmer" style={{ width: '100%', height: '48px', borderRadius: '8px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <div className="skeleton-shimmer" style={{ width: '90px', height: '14px' }} />
                <div className="skeleton-shimmer" style={{ width: '80px', height: '14px' }} />
              </div>
            </div>
          ))
        ) : signs.length > 0 ? (
          signs.map((s) => (
            <div key={s.id} className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>{s.word}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--primary-emerald)', fontWeight: '700' }}>GLOSS: {s.gloss}</span>
                </div>
                <span style={{ fontSize: '11px', background: 'var(--mint-badge)', color: 'var(--mint-text)', padding: '2px 8px', borderRadius: '8px', fontWeight: '600' }}>
                  {s.province}
                </span>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {s.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '8px', marginTop: '4px' }}>
                <span>By: <b>{s.submitted_by}</b></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#DB2777' }}>
                  <Heart size={12} fill="#DB2777" /> Community Verified
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card" style={{ padding: '30px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <Sparkles size={28} color="var(--primary-emerald)" style={{ margin: '0 auto 10px auto' }} />
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>No Community Signs Yet</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Be the first educator or student to contribute a regional SASL variation!</p>
          </div>
        )}
      </div>

    </div>
  );
}
