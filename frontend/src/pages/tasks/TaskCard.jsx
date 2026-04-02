import { format, isPast, parseISO } from 'date-fns';
import './Tasks.css';

const STATUS_LABEL = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };
const STATUS_CLASS = { todo: 'badge-todo', 'in-progress': 'badge-inprogress', done: 'badge-done' };

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const isOverdue = task.dueDate && task.status !== 'done' && isPast(parseISO(task.dueDate));

  return (
    <div className={`task-card ${task.status === 'done' ? 'task-card-done' : ''}`}>
      <div className="task-card-top">
        <div className="task-card-badges">
          <span className={`badge ${STATUS_CLASS[task.status]}`}>{STATUS_LABEL[task.status]}</span>
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
        </div>
        <div className="task-card-actions">
          <button className="task-action-btn" onClick={() => onEdit(task)} aria-label="Edit task" title="Edit">✎</button>
          <button className="task-action-btn danger" onClick={() => onDelete(task._id)} aria-label="Delete task" title="Delete">✕</button>
        </div>
      </div>

      <h3 className={`task-card-title ${task.status === 'done' ? 'done' : ''}`}>{task.title}</h3>

      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}

      {task.tags?.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag) => (
            <span key={tag} className="task-tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="task-card-footer">
        {task.dueDate && (
          <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
            {isOverdue ? '⚠ ' : '📅 '}
            {format(parseISO(task.dueDate), 'MMM d, yyyy')}
          </span>
        )}

        <select
          className="task-status-select"
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          aria-label="Change status"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
