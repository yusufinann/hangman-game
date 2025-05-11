import { useState, useCallback } from 'react';

export const useGameNotifications = (initialNotifications = []) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const addNotification = useCallback((text, severity = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [{ id, text, severity }, ...prev.slice(0, 3)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return { notifications, addNotification, setNotifications, clearAllNotifications };
};