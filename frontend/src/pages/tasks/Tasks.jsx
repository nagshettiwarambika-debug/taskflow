import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import './Tasks.css';

const Tasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    search: searchParams.get('search') || '',
    sort: '-createdAt',
  });

  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
  );

  // Open form if ?new=1
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setShowForm(true);
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ status: '', priority: '', search: '', sort: '-createdAt' });
  };

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await createTask(data);
      setShowForm(false);
      showToast('Task created!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    try {
      await updateTask(editingTask._id, data);
      setEditingTask(null);
      showToast('Task updated!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setDeleteConfirm(null);
    showToast('Task deleted.', 'success');
  };

  const handleStatusChange = async (id, status) => {
    try {
      const task = tasks.find((t) => t._id === id);
      await updateTask(id, { ...task, status });
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  const hasFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="tasks-page animate-fade-in">
      {/* Header */}
      <div className="tasks-header">
        <div>
          <h1 className="tasks-title">My Tasks</h1>
          <p className="tasks-count">
            {loading ? 'Loading…' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
            {hasFilters && ' (filtered)'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div className="tasks-filters">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search tasks…"
            value={filters.search}
            onChange={(e) => handleFilter('search', e.target.value)}
          />
        </div>

        <select
          className="form-select filter-select"
          value={filters.status}
          onChange={(e) => handleFilter('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          className="form-select filter-select"
          value={filters.priority}
          onChange={(e) => handleFilter('priority', e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          className="form-select filter-select"
          value={filters.sort}
          onChange={(e) => handleFilter('sort', e.target.value)}
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="-priority">Priority (High→Low)</option>
          <option value="dueDate">Due Date</option>
        </select>

        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={handleClearFilters}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Content */}
      {loading ? (
        <div className="tasks-loading">
          <span className="spinner" style={{ width: 32, height: 32, borderTopColor: 'var(--accent)' }} />
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>{hasFilters ? 'No matching tasks' : 'No tasks yet'}</h3>
          <p>
            {hasFilters
              ? 'Try clearing your filters to see all tasks.'
              : 'Create your first task to get started.'}
          </p>
          {!hasFilters && (
            <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => setShowForm(true)}>
              + New Task
            </button>
          )}
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={(t) => setEditingTask(t)}
              onDelete={(id) => setDeleteConfirm(id)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showForm && (
        <TaskForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          loading={submitting}
        />
      )}

      {/* Edit Modal */}
      {editingTask && (
        <TaskForm
          initialData={editingTask}
          onSubmit={handleUpdate}
          onClose={() => setEditingTask(null)}
          loading={submitting}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h2>Delete Task</h2>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Are you sure you want to delete this task? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(deleteConfirm)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? '✓' : '⚠'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default Tasks;
