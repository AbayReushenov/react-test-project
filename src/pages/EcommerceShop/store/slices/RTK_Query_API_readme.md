# RTK Query API: Современная работа с API в React

уководство поможет освоить **RTK Query**

## 📌 Зачем RTK Query?
RTK Query — часть **Redux Toolkit**, которая заменяет ручное управление состоянием загрузки/ошибок и дублирование логики запросов. Он автоматизирует:

- Кэширование данных
- Отслеживание состояния запросов (loading, error)
- Инвалидацию кэша при мутациях
- Автоматическую повторную выборку данных при возврате на вкладку или потере фокуса

**Преимущества перед классическими подходами:**
- Нет бойлерплейта для состояний (`isLoading`, `isError`)
- Встроенное кэширование уменьшает количество запросов
- Типизация «из коробки» (если используешь TypeScript)
- Оптимистичные обновления и атомарные мутации

---

## ⚙️ Установка и настройка

### 1. Установка
```bash
npm install @reduxjs/toolkit react-redux
# Или
yarn add @reduxjs/toolkit react-redux
```

### 2. Настройка Store
Создай файл `store.js`:
```javascript
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api'; // Позже создадим этот файл

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch); // Опционально: для refetchOnFocus/refetchOnReconnect
```

### 3. Провайдер в приложении
```jsx
// index.js
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

---

## 🧩 Основные концепции

### 1. Создание API-слайса
Файл `api.js`:
```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.example.com/' }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => 'posts',
    }),
    addPost: builder.mutation({
      query: (body) => ({
        url: 'posts',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = api;
```

### 2. Использование хуков в компонентах
```jsx
function PostsList() {
  const { data, error, isLoading } = useGetPostsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```

**Особенности:**
- `useGetPostsQuery` автоматически запускает запрос при монтировании компонента
- Состояние (`data`, `error`, `isLoading`) обновляется реактивно
- Кэширование работает между разными компонентами

---

## 🔁 Работа с мутациями

Пример отправки формы:
```jsx
function AddPostForm() {
  const [addPost, { isLoading }] = useAddPostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPost({ title: 'Новый пост' });
      // RTK Query автоматически инвалидирует связанный кэш
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={isLoading} type="submit">
        {isLoading ? 'Отправка...' : 'Добавить пост'}
      </button>
    </form>
  );
}
```

**Важно:** Для автоматического обновления списка постов используй [теги](#-кэширование-и-инвалидация).

---

## 🧠 Кэширование и инвалидация

RTK Query автоматически кэширует результаты запросов. Чтобы связать мутации и запросы:

### 1. Определите теги
```javascript
export const api = createApi({
  // ...
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => 'posts',
      providesTags: ['Posts'], // Помечаем данные тегом
    }),
    addPost: builder.mutation({
      query: (body) => ({ /* ... */ }),
      invalidatesTags: ['Posts'], // Инвалидируем тег при мутации
    }),
  }),
});
```

### 2. Стратегии кэширования
Настройте поведение для оптимизации:
```javascript
const { data } = useGetPostsQuery(undefined, {
  refetchOnMountOrArgChange: 60, // Перезагружать, если данные старше 60 сек
  pollingInterval: 5000, // Авто-опрос каждые 5 сек
});
```

**Совет:** Используйте `refetchOnFocus: true` в `setupListeners`, чтобы обновлять данные при возврате на вкладку.

---

## 🚀 Лучшие практики

### 1. Организация файлов
Разделяйте API на логические части:
```
src/
├── services/
│   ├── postsApi.js
│   ├── usersApi.js
│   └── index.js (экспорт всех API)
```

### 2. Кастомные хуки
Инкапсулируйте логику:
```javascript
// hooks/usePosts.js
export const usePosts = () => {
  const { data, ...rest } = useGetPostsQuery();
  return { posts: data || [], ...rest };
};
```

### 3. Глобальные настройки
Вынесите базовый URL и заголовки:
```javascript
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});
```

### 4. Работа с пагинацией
Используйте аргументы запроса:
```javascript
getPosts: builder.query({
  query: ({ page = 1, limit = 10 }) => `posts?page=${page}&limit=${limit}`,
});
```

### 5. Optimistic Updates (осторожно!)
Для мгновенного отклика UI:
```javascript
addPost: builder.mutation({
  queryFn: async (arg, api, extraOptions, baseQuery) => {
    // Локально добавляем пост в кэш
    api.dispatch(api.util.updateQueryData('getPosts', undefined, (draft) => {
      draft.push({ id: 'temp', ...arg });
    }));

    try {
      const result = await baseQuery({ /* ... */ });
      return { data: result.data };
    } catch (error) {
      // Откат при ошибке
      api.dispatch(api.util.invalidateTags(['Posts']));
      return { error };
    }
  },
});
```

---

## ⚠️ Частые ошибки

1. **Игнорирование тегов**
   Без тегов кэш не будет инвалидироваться после мутаций, и пользователь увидит старые данные.

2. **Избыточные запросы**
   Не используй `useEffect` для вызова мутаций — RTK Query сам управляет жизненным циклом.

3. **Смешение RTK Query и ручного состояния**
   Не храните данные из API в локальном состоянии (`useState`) — это нарушает преимущества кэширования.

4. **Отсутствие обработки ошибок**
   Всегда проверяй `error` в рендере или используй общий обработчик в `baseQuery`.

---

## 💡 Советы для быстрого старта

- Используй **RTK Query DevTools** (встроены в Redux DevTools) для отладки кэша.
- Для аутентификации передавай токен через `prepareHeaders` в `fetchBaseQuery`.
- Начинай с простых запросов, постепенно добавляя теги и оптимистичные обновления.
- Изучи [официальную документацию](https://redux-toolkit.js.org/rtk-query/overview) — она отлично структурирована.

---

## Заключение

RTK Query — это стандарт де-факто для работы с API в Redux-приложениях. Он сокращает количество кода, упрощает управление состоянием и повышает производительность за счет кэширования. Начни с малого: замени один эндпоинт в своем проекте и постепенно внедряй продвинутые фичи.

**Главное правило:** «Если ты пишешь `useState` для загрузки данных из API — ты делаешь что-то не так». RTK Query берет это на себя. 🚀
