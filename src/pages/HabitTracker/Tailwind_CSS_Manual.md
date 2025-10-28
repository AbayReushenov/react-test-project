# Tailwind CSS в React Projects - Полное руководство

## Установка и настройка

### 1. Создание нового проекта React + Vite

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
```

### 2. Установка Tailwind CSS (новый способ)

```bash
npm install -D @tailwindcss/vite
```

### 3. Конфигурация Vite (vite.config.ts)

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    css: {
        postcss: {
            plugins: [autoprefixer()],
        },
    },
})
```

### 4. Добавление Tailwind директив в CSS

Создайте файл `src/index.css`:

```css
@import "tailwindcss";
```

### 5. Импорт CSS в главный файл

В `src/main.jsx` или `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## Основы использования в React компонентах

### Функциональные компоненты с Tailwind

```tsx
// src/components/Button.tsx
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export const Button = ({ children, variant = 'primary', onClick }: ButtonProps) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-200"
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800"
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### Условные классы с clsx

Установите `clsx` для удобной работы с условными классами:

```bash
npm install clsx
```

```tsx
// src/components/Alert.tsx
import { clsx } from 'clsx'

interface AlertProps {
  type: 'success' | 'error' | 'warning'
  message: string
}

export const Alert = ({ type, message }: AlertProps) => {
  const alertClasses = clsx(
    "p-4 rounded-lg border",
    {
      "bg-green-100 border-green-400 text-green-800": type === 'success',
      "bg-red-100 border-red-400 text-red-800": type === 'error',
      "bg-yellow-100 border-yellow-400 text-yellow-800": type === 'warning'
    }
  )

  return (
    <div className={alertClasses}>
      {message}
    </div>
  )
}
```

## Работа с макетами (Layouts)

### Компонент Layout

```tsx
// src/components/Layout.tsx
interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="text-xl font-bold text-gray-800">
              MyApp
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 MyApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
```

### Использование Layout

```tsx
// src/App.tsx
import { Layout } from './components/Layout'
import { Button } from './components/Button'

function App() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to MyApp
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          This is a React application with Tailwind CSS
        </p>
        <div className="flex space-x-4">
          <Button variant="primary">Get Started</Button>
          <Button variant="secondary">Learn More</Button>
        </div>
      </div>
    </Layout>
  )
}

export default App
```

## Responsive Design

### Адаптивные классы

```tsx
// src/components/ResponsiveCard.tsx
export const ResponsiveCard = () => {
  return (
    <div className="
      w-full
      max-w-sm
      mx-auto
      md:max-w-md
      lg:max-w-lg
      xl:max-w-xl
      bg-white
      rounded-xl
      shadow-lg
      p-6
      md:p-8
      lg:p-10
    ">
      <h2 className="
        text-2xl
        font-bold
        text-gray-800
        mb-4
        md:text-3xl
        lg:text-4xl
      ">
        Responsive Card
      </h2>
      <p className="
        text-gray-600
        mb-6
        md:text-lg
      ">
        This card adapts to different screen sizes
      </p>
      <div className="
        flex
        flex-col
        space-y-4
        sm:flex-row
        sm:space-y-0
        sm:space-x-4
      ">
        <button className="
          flex-1
          bg-blue-600
          text-white
          py-2
          px-4
          rounded
          hover:bg-blue-700
          transition-colors
        ">
          Primary Action
        </button>
        <button className="
          flex-1
          bg-gray-200
          text-gray-800
          py-2
          px-4
          rounded
          hover:bg-gray-300
          transition-colors
        ">
          Secondary Action
        </button>
      </div>
    </div>
  )
}
```

## Dark Mode

### Настройка темной темы

```tsx
// src/components/ThemeToggle.tsx
import { useState, useEffect } from 'react'

export const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))
    document.documentElement.classList.toggle('dark', newDarkMode)
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
    >
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
```

### Использование dark mode классов

```tsx
// src/components/DarkModeComponent.tsx
export const DarkModeComponent = () => {
  return (
    <div className="
      bg-white
      dark:bg-gray-900
      text-gray-900
      dark:text-white
      p-6
      rounded-lg
      shadow-lg
    ">
      <h2 className="text-2xl font-bold mb-4">Dark Mode Support</h2>
      <p className="mb-4">
        This component automatically adapts to light and dark themes.
      </p>
      <div className="
        bg-gray-100
        dark:bg-gray-800
        p-4
        rounded
      ">
        <p>Nested content with proper dark mode styling</p>
      </div>
    </div>
  )
}
```

## Формы и интерактивные элементы

### Форма с валидацией

```tsx
// src/components/ContactForm.tsx
import { useState } from 'react'

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Handle form submission
      console.log('Form submitted:', formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${errors.name ? 'border-red-500' : 'border-gray-300'}
          `}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${errors.email ? 'border-red-500' : 'border-gray-300'}
          `}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${errors.message ? 'border-red-500' : 'border-gray-300'}
          `}
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Send Message
      </button>
    </form>
  )
}
```

## Анимации и переходы

### Простые анимации

```tsx
// src/components/AnimatedCard.tsx
import { useState } from 'react'

export const AnimatedCard = () => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="p-8">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        {isVisible ? 'Hide' : 'Show'} Card
      </button>

      {isVisible && (
        <div className="
          bg-white
          p-6
          rounded-lg
          shadow-lg
          transform
          transition-all
          duration-300
          ease-in-out
          hover:scale-105
          hover:shadow-xl
        ">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Animated Card
          </h3>
          <p className="text-gray-600">
            This card has smooth transitions and hover effects.
          </p>
        </div>
      )}
    </div>
  )
}
```

## Кастомная конфигурация Tailwind

### tailwind.config.js (опционально)

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

## Лучшие практики

### 1. Организация классов

```tsx
// ✅ Хорошо - логические группы
<div className="
  // Layout
  flex items-center justify-between

  // Spacing
  p-6 mb-4

  // Colors & Effects
  bg-white shadow-lg rounded-xl

  // Typography
  text-gray-800 text-lg font-medium
">
  Content
</div>

// ❌ Плохо - беспорядок
<div className="flex p-6 bg-white text-gray-800 items-center shadow-lg rounded-xl mb-4 text-lg justify-between font-medium">
  Content
</div>
```

### 2. Извлечение повторяющихся стилей

```tsx
// src/styles/buttonClasses.ts
export const buttonClasses = {
  base: "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
  primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
  danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
}
```

### 3. Использование CSS-переменных для динамических значений

```tsx
// src/components/ProgressBar.tsx
interface ProgressBarProps {
  progress: number // 0-100
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
```

## Полезные команды

```bash
# Запуск разработки
npm run dev

# Сборка для продакшена
npm run build

# Превью продакшн сборки
npm run preview

# Установка дополнительных зависимостей
npm install clsx
npm install -D @types/node
```

Это руководство покрывает основные аспекты использования Tailwind CSS в React проектах с Vite. 
