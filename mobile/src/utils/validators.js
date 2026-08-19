export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 20;
};

export const validateTodoTitle = (title) => {
  return title && title.trim().length > 0 && title.trim().length <= 200;
};

export const getTodoForm = () => ({
  title: '',
  description: '',
  status: 'TO_BE_START',
  priority: 'MEDIUM',
  dueDate: null,
});
