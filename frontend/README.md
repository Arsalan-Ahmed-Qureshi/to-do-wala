# ToDoTask Frontend

A modern React + Vite frontend for the ToDoTask application with real-time task management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Backend API running at `http://localhost:8080`

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header
│   │   ├── Header.module.css
│   │   ├── TodoForm.jsx        # Task creation/edit form
│   │   ├── TodoForm.module.css
│   │   ├── TodoList.jsx        # Task list container
│   │   ├── TodoList.module.css
│   │   ├── TodoItem.jsx        # Individual task item
│   │   └── TodoItem.module.css
│   ├── pages/                  # Page components (future)
│   ├── services/
│   │   └── api.js              # Axios API client
│   ├── hooks/
│   │   └── useTodos.js         # Custom hook for todos
│   ├── App.jsx                 # Main app component
│   ├── App.css
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── public/                     # Static assets
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🛠️ Build & Deploy

### Build for Production

```bash
npm run build
```

Generates optimized build in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📦 Dependencies

```json
{
  "react": "^18.2.0",           // UI library
  "react-dom": "^18.2.0",       // React DOM
  "axios": "^1.6.5",             // HTTP client
  "react-router-dom": "^6.20.1"  // Routing
}
```

## 🔧 Configuration

### API Base URL
Edit `src/services/api.js`:
```javascript
const API_BASE_URL = '/api';  // Proxied via Vite
```

### Vite Proxy
Edit `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  }
}
```

## 🎨 Styling

Uses CSS Modules for component-scoped styles and CSS variables for theming.

### Color Scheme
```css
--color-primary: #3b82f6
--color-secondary: #10b981
--color-danger: #ef4444
--color-warning: #f59e0b
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint at 768px
- Fully responsive components

## 🚀 Features

- ✅ Create tasks
- ✅ Edit tasks
- ✅ Delete tasks
- ✅ Mark complete/incomplete
- ✅ Filter by status
- ✅ Priority levels
- ✅ Due dates
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive UI

## 🔄 API Integration

### Fetch All Tasks
```javascript
import { todoAPI } from './services/api';

const todos = await todoAPI.getAll();
```

### Create Task
```javascript
const newTodo = await todoAPI.create({
  title: "Task title",
  description: "Task description",
  priority: "HIGH",
  dueDate: "2024-12-31T23:59:59"
});
```

### Update Task
```javascript
const updated = await todoAPI.update(id, {
  completed: true
});
```

### Delete Task
```javascript
await todoAPI.delete(id);
```

## 🎯 Component Overview

### Header
- Displays app title
- Filter buttons (All, Active, Completed)
- Active task count

### TodoForm
- Form for creating/editing tasks
- Input validation
- Priority and due date selection

### TodoList
- Renders list of tasks
- Handles task interactions
- Empty state

### TodoItem
- Individual task display
- Checkbox for completion
- Edit and delete actions
- Priority badge

## ⚙️ Environment Variables

Create `.env.local`:
```
VITE_API_URL=http://localhost:8080/api
```

## 🐛 Debugging

### Enable debug logging
Add to `src/services/api.js`:
```javascript
api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

## 📊 Performance

- Optimized builds with Vite
- Code splitting for routes (future)
- Lazy loading components (future)
- Minimal dependencies

## 🔐 Security

- CORS headers configured
- Input validation
- Error handling
- XSS protection via React

## 🚀 Future Enhancements

- [ ] Authentication/Authorization
- [ ] User profiles
- [ ] Task categories
- [ ] Task sharing
- [ ] Notifications
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Offline support
- [ ] Analytics

## 📚 Learn More

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Axios Documentation](https://axios-http.com)

## 📄 License

MIT License
