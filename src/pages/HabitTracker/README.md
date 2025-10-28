# Habit Tracker

Простой трекер привычек на React + Zustand + Tailwind CSS.

## Возможности
- Добавление привычек с категорией
- Отметка выполнения на текущую дату
- Удаление привычек
- Сохранение состояния в LocalStorage (через Zustand persist)

## Технологии
- React + TypeScript
- Zustand (persist + devtools)
- Tailwind CSS v4 (через `@tailwindcss/vite`)
- Vite

## Структура
```
src/pages/HabitTracker/
├── src/
│   ├── components/
│   │   ├── HabitForm.tsx
│   │   └── HabitList.tsx
│   ├── pages/
│   │   └── Home.tsx
│   ├── store/
│   │   └── habitsStore.ts
│   ├── HabitTrackers.tsx
│   └── index.css   # @import "tailwindcss"
├── Tailwind_CSS_Manual.md
├── Tailwind_CSS_Helper.md
├── Test_Manual_Timedatectl_command.md
└── README.md (вы здесь)
```

## Подключение в приложении
Маршрут уже добавлен в `src/router.tsx` как `habit-tracker` и ссылка есть в сайдбаре.

## Запуск
```bash
npm run dev
```
Откройте раздел "Трекер привычек".

## Примечания по стилям
- Tailwind загружается из `src/pages/HabitTracker/src/index.css`
- Глобальные стили не перекрывают Tailwind (убраны цвет и фон у `button`)

## Как это работает
- Хранение состояния: `zustand` + `persist` => данные сохраняются между перезагрузками
- Кнопка "Отметить": переключает наличие сегодняшней даты в массиве `completed`
- Состояние кнопки визуализируется цветом и текстом (Tailwind классы)
