import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { format } from 'date-fns';
import './Dashboard.css';

const StatCard = ({ label, value, color, icon }) => (
  <div className="stat-card" style={{ '--stat-color': color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tasks, stats, loading } = useTasks({ sort: '-createdAt', limit: 5 });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const byStatus = stats?.byStatus ?? { todo: 0, 'in-progress': 0, done: 0 };
  const byPriority = stats?.byPriority ?? { low: 0, medium: 0, high: 0 };
  const total = stats?.total ?? 0;
  const completionRate = total ? Math.round((byStatus.done / total) * 100) : 0;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <span className="spinner" style={{ width: 32, height: 32, borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="dashboard animate-fade-in">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-greeting">{greeting()},</p>
          <h1 className="dashboard-name">{user?.name} 👋</h1>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/tasks?new=1')}>
          + New Task
        </button>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Tasks" value={total} color="var(--accent)" icon="📋" />
        <StatCard label="To Do" value={byStatus.todo} color="var(--text-secondary)" icon="○" />
        <StatCard label="In Progress" value={byStatus['in-progress']} color="var(--blue)" icon="◑" />
        <StatCard label="Completed" value={byStatus.done} color="var(--green)" icon="●" />
      </div>

      <div className="dashboard-body">
        <div className="card progress-card">
          <div className="progress-header">
            <h2>Overall Progress</h2>
            <span className="progress-pct">{completionRate}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${completionRate}%` }} />
          </div>
          <div className="priority-breakdown">
            <h3>By Priority</h3>
            <div className="priority-bars">
              {[
                { key: 'high', label: 'High', color: 'var(--red)' },
                { key: 'medium', label: 'Medium', color: 'var(--accent)' },
                { key: 'low', label: 'Low', color: 'var(--green)' },
              ].map(({ key, label, color }) => {
                const count = byPriority[key] ?? 0;
                const pct = total ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={key} className="priority-bar-row">
                    <span className="priority-bar-label">{label}</span>
                    <div className="priority-bar-track">
                      <div className="priority-bar-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="priority-bar-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card recent-card">
          <div className="recent-header">
            <h2>Recent Tasks</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tasks')}>
              View all →
            </button>
          </div>
          {tasks.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-state-icon">📭</div>
              <h3>No tasks yet</h3>
              <p>Create your first task to get started</p>
            </div>
          ) : (
            <ul className="recent-tasks">
              {tasks.slice(0, 5).map((task) => (
                <li key={task._id} className="recent-task-item" onClick={() => navigate('/tasks')}>
                  <div className="recent-task-dot" style={{
                    background: task.status === 'done' ? 'var(--green)' :
                      task.status === 'in-progress' ? 'var(--blue)' : 'var(--text-muted)',
                  }} />
                  <div className="recent-task-info">
                    <span className={`recent-task-title ${task.status === 'done' ? 'done' : ''}`}>
                      {task.title}
                    </span>
                    <span className="recent-task-date">
                      {format(new Date(task.createdAt), 'MMM d')}
                    </span>
                  </div>
                  <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;