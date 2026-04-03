import { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../api/tasksAPI';

export const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, byStatus: { todo: 0, 'in-progress': 0, done: 0 }, byPriority: { low: 0, medium: 0, high: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksRes, statsRes] = await Promise.all([
        tasksAPI.getAll(filters),
        tasksAPI.getStats(),
      ]);
      setTasks(tasksRes.data.tasks);
      setStats(statsRes.data.stats ?? statsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (data) => {
    const { data: newTask } = await tasksAPI.create(data);
    setTasks((prev) => [newTask, ...prev]);
    setStats((prev) => prev ? ({
      ...prev,
      total: prev.total + 1,
      byStatus: { ...prev.byStatus, [newTask.status]: (prev.byStatus[newTask.status] || 0) + 1 },
      byPriority: { ...prev.byPriority, [newTask.priority]: (prev.byPriority[newTask.priority] || 0) + 1 },
    }) : prev);
    return newTask;
  };

  const updateTask = async (id, data) => {
    const { data: updated } = await tasksAPI.update(id, data);
    setTasks((prev) => prev.map((t) => t._id === id ? updated : t));
    await fetchTasks(); // Refresh stats
    return updated;
  };

  const deleteTask = async (id) => {
    await tasksAPI.delete(id);
    const removed = tasks.find((t) => t._id === id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    if (removed) {
      setStats((prev) => prev ? ({
        ...prev,
        total: prev.total - 1,
        byStatus: { ...prev.byStatus, [removed.status]: Math.max(0, prev.byStatus[removed.status] - 1) },
        byPriority: { ...prev.byPriority, [removed.priority]: Math.max(0, prev.byPriority[removed.priority] - 1) },
      }) : prev);
    }
  };

  return { tasks, stats, loading, error, createTask, updateTask, deleteTask, refetch: fetchTasks };
};
