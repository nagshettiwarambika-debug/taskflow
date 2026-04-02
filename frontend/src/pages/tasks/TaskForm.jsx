import { useState, useEffect } from 'react';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  tags: '',
};

const TaskForm = ({ onSubmit, onClose, initialData, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'todo',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate ? initialData.dueDate.substring(0, 10) : '',
        tags: (initialData.tags || []).join(', '),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (form.title.trim().length > 120) { setError('Title cannot exceed 120 characters.'); return; }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{initialData ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="tf-title">Title *</label>
            <input
              id="tf-title"
              type="text"
              name="title"
              className="form-input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              maxLength={120}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tf-desc">Description</label>
            <textarea
              id="tf-desc"
              name="description"
              className="form-textarea"
              placeholder="Add more details…"
              value={form.description}
              onChange={handleChange}
              maxLength={1000}
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="tf-status">Status</label>
              <select id="tf-status" name="status" className="form-select" value={form.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tf-priority">Priority</label>
              <select id="tf-priority" name="priority" className="form-select" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tf-due">Due Date</label>
            <input
              id="tf-due"
              type="date"
              name="dueDate"
              className="form-input"
              value={form.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().substring(0, 10)}
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tf-tags">Tags <span style={{ fontWeight: 400, textTransform: 'none', color: 'var(--text-muted)' }}>(comma-separated)</span></label>
            <input
              id="tf-tags"
              type="text"
              name="tags"
              className="form-input"
              placeholder="design, backend, urgent"
              value={form.tags}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? <><span className="spinner" /> Saving…</> : initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
