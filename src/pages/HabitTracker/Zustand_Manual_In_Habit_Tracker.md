# Руководство по Zustand в проекте Habit Tracker

Это подробное руководство для junior-разработчиков, которые хотят понять, как работает библиотека **Zustand** для управления состоянием в React-приложении. Мы разберём пример из пет-проекта **Habit Tracker** (трекер привычек), где Zustand используется для хранения списка привычек, их добавления, удаления и отметки выполнения.

Руководство основано на коде проекта: стор (`habitsStore.ts`), компоненты (`HabitForm.tsx`, `HabitList.tsx`, `HabitTracker.tsx`) и другие файлы.
Если что-то неясно, смотри на официальную документацию Zustand (https://zustand.docs.pmnd.rs).

## 1. Что такое Zustand и зачем он нужен?

Zustand — это простая и лёгкая библиотека для управления глобальным состоянием (state) в React-приложениях. В отличие от Redux (который тяжёлый и требует много boilerplate-кода), Zustand создаёт "магазин" (store) за одну строку кода и позволяет легко обновлять данные в любом компоненте.

**Для junior:** Представь состояние приложения как корзину с покупками. Без Zustand каждый компонент имеет свою мини-корзину — данные не синхронизированы. Zustand даёт одну общую корзину, куда все компоненты могут добавлять/удалять товары и видеть изменения в реальном времени. Это решает проблемы, когда данные "теряются" при перерендере компонентов.

В нашем проекте Zustand хранит:

- Список привычек (массив объектов с `id`, `name`, `category`, `completed` — массив дат выполнения).
- Функции для работы с привычками: добавление, переключение статуса, удаление  (habitsStore.ts).

**Преимущества для начинающих:**

- Нет провайдера (как в Context API) — просто хук `useStore`.
- Автоматический ререндер компонентов при изменении состояния.
- Поддержка TypeScript из коробки.
- Размер библиотеки: всего ~2KB.

Установка: `npm install zustand`. В проекте уже установлен.

## 2. Создание стора (Store) в Zustand

Сердце Zustand — это **стор** (store), который выглядит как обычная функция с состоянием и методами. Стор создаётся с помощью `create` из Zustand.

В файле `habitsStore.ts` стор выглядит так:

```ts
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface Habit {
  id: number
  name: string
  category: string
  completed: string[]  // Массив дат в формате YYYY-MM-DD
}

interface StoreState {
  habits: Habit[]
  addHabit: (name: string, category: string) => void
  toggleHabit: (id: number, date: string) => void
  removeHabit: (id: number) => void
}

export const useHabitsStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Состояние (state): начальный массив пустых привычек
        habits: [],

        // Действие (action): добавление новой привычки
        addHabit: (name, category) =>
          set((state) => ({
            habits: [
              ...state.habits,
              { id: Date.now(), name, category, completed: [] }
            ]
          })),

        // Действие: переключение статуса привычки на дату
        toggleHabit: (id, date) =>
          set((state) => ({
            habits: state.habits.map((habit) =>
              habit.id === id
                ? {
                    ...habit,
                    completed: habit.completed.includes(date)
                      ? habit.completed.filter((d) => d !== date)
                      : [...habit.completed, date]
                  }
                : habit
            )
          })),

        // Действие: удаление привычки
        removeHabit: (id) =>
          set((state) => ({
            habits: state.habits.filter((h) => h.id !== id)
          }))
      }),
      { name: 'habits-storage' }  // Ключ для localStorage
    )
  )
)
```

**Разбор для junior:**

- `create<StoreState>()` — создаёт хук `useHabitsStore`. TypeScript-интерфейс `StoreState` описывает, что внутри стора: массив `habits` и функции.
- `(set, get) => ({ ... })` — это **создатель стора**. `set` — функция для обновления состояния (иммутабельно, всегда новый объект). `get` — для чтения текущего состояния (используется редко).
- **Иммутабельность:** Всегда возвращай новый объект/массив, а не мутируй старый (например, `...state.habits` вместо `state.habits.push()`). Это важно для React, чтобы компоненты перерендерились.
- `Date.now()` — простая генерация ID (для junior-проекта хватит; в реальности используй UUID)  (habitsStore.ts).

**Как это работает внутри:** Zustand использует Proxy (встроенный в JS) для отслеживания изменений. Когда `set` вызывается, стор уведомляет все подписанные компоненты: "Эй, состояние изменилось — перерендерись!".

## 3. Состояние (State) в сторе

Состояние — это данные, которые хранятся в сторе. В нашем случае:

- `habits: Habit[]` — массив объектов. Каждый `Habit` имеет:
    - `id`: уникальный номер.
    - `name`: название привычки (например, "Бегать 30 мин").
    - `category`: категория (например, "Спорт").
    - `completed`: массив строк с датами (YYYY-MM-DD), когда привычка выполнена.

**Для junior:** Состояние как переменная в классе, но глобальная. Оно сохраняется между рендерами и компонентами. Если не обновить через `set`, ничего не изменится. В проекте начальное состояние — пустой массив, так что после перезагрузки (без persist) привычки исчезнут  (habitsStore.ts).

Пример: После добавления привычки массив станет `[{ id: 123, name: "Чтение", category: "Саморазвитие", completed: [] }]`.

## 4. Действия (Actions) — как обновлять состояние

Actions — это функции внутри стора для изменения состояния. Они вызывают `set` с новым состоянием.

**Разбор действий из кода:**

- `addHabit(name, category)`: Создаёт новую привычку с ID и добавляет в конец массива. Использует spread-оператор `...` для копирования старого массива + новая запись. Это иммутабельно.
- `toggleHabit(id, date)`: Находит привычку по ID (через `map`), проверяет, есть ли дата в `completed`:
    - Если есть — удаляет (`filter`).
    - Если нет — добавляет (`...completed, date`).
    - Возвращает новый массив привычек. Это переключает чекбокс (toggle)  (HabitList.tsx).
- `removeHabit(id)`: Фильтрует массив, удаляя элемент с нужным ID.

**Для junior:** Actions как методы класса. Они не асинхронные (для простоты), но Zustand поддерживает async (например, `addHabit: async (name) => { await fetch(...); set(...) }`). В нашем проекте все синхронные, так что обновление мгновенное.

**Почему toggle может не работать (диагностика):** Если дата не сегодня (`new Date().toISOString().split('T')`), или ID не совпадает — ничего не изменится. Проверь в консоли: `console.log(useHabitsStore.getState().habits)` после клика.

## 5. Middleware: persist — сохранение в localStorage

Middleware — это "обёртки" вокруг стора для доп. функционала. `persist` сохраняет состояние в localStorage браузера, чтобы данные не терялись при перезагрузке страницы.

В коде: `persist((set, get) => ({ ... }), { name: 'habits-storage' })`

- `name` — ключ в localStorage (проверь в DevTools → Application → Local Storage).
- При загрузке страницы: Zustand читает из storage и восстанавливает `habits`.
- При изменении: Автоматически сохраняет (JSON.stringify).

**Для junior:** Без persist — как записная книжка, которую стирают при закрытии. С persist — данные остаются. В проекте: Добавь привычку, обнови страницу — она на месте! Если хочешь кастомизировать (например, сохранять в IndexedDB), используй опции `persist`

**Плюсы:** Простота, работает оффлайн. Минусы: Не для больших данных (localStorage ~5MB).

## 6. Middleware: devtools — отладка в Redux DevTools

`devtools` подключает стор к Redux DevTools (расширение браузера). Устанавливаешь Redux DevTools в Chrome, и видишь:

- Текущее состояние `habits`.
- Историю действий (addHabit, toggleHabit).
- Время путешествий (time travel): можно "откатить" изменения.

В коде: `devtools(persist(...))` — оборачивает весь стор. Работает из коробки.

**Для junior:** Установи расширение Redux DevTools. Запусти проект, добавь привычку — в DevTools увидишь обновление стора. Полезно для дебаггинга: "Почему состояние не изменилось?" Кликни на action — увидишь diff (что добавилось/удалилось).

**Совет:** В production отключай `devtools`, чтобы не замедлять (опция `devtools(..., { name: 'Habit Store' })`).

## 7. Использование стора в компонентах React

В компонентах подключаешься через хук `useHabitsStore`. Он возвращает всё состояние и actions.

**Пример из HabitForm.tsx:**

```tsx
const addHabit = useHabitsStore((state) => state.addHabit)  // Селектор: только action
const [name, setName] = useState('')
// В onSubmit: if (name) addHabit(name, category)
```

- **Селектор `(state) => state.addHabit`**: Берёт только нужное, чтобы компонент не ререндерился лишний раз (оптимизация). Без селектора — весь стор, что может замедлить.

**Пример из HabitList.tsx:**

```tsx
const { habits, toggleHabit, removeHabit } = useHabitsStore()  // Полный хук
// В map: habit.completed.includes(today) для чекбокса
// onClick: toggleHabit(habit.id, today)
```

- Компонент перерендерится, если `habits` изменился (Zustand сравнивает ссылки на объекты).
- Для сложных селекторов: `const completedHabits = useHabitsStore(state => state.habits.filter(h => h.completed.length > 0))`  (HabitList.tsx).

**Для junior:** Хук работает как `useState`, но глобальный. React автоматически подписывается: изменение стора → ререндер. Если не ререндерится — проверь селектор или иммутабельность.

В `HabitTracker.tsx` (Home.tsx): Импорт стора, рендер форм и списка. Всё состояние видно везде  (Home.tsx).

## 8. Другие функции и лучшие практики в проекте

- **Селекторы для оптимизации:** В больших приложениях используй `useShallow` из Zustand, чтобы избежать ререндеров при изменении глубоко вложенных объектов (не нужно в нашем простом проекте).
- **Slices (разделение стора):** Если стор большой, дели на части: `create((...a) => ({ user: createUserSlice(...a), habits: createHabitsSlice(...a) }))`. В нашем — один slice.
- **Async actions:** Для API: `fetchHabit: async (id) => { const data = await fetch(); set({ habits: data }) }`. В проекте нет, но легко добавить.
- **Подписка вне React:** `useHabitsStore.subscribe(console.log)` — для логирования изменений (полезно для дебаггинга).
- **Persist опции:** Можно исключить поля: `{ partialize: (state) => ({ habits: state.habits }) }` — не сохранять sensitive данные.

**Общие советы для junior:**

- Всегда иммутабельно: Используй `map`, `filter`, spread.
- Тестируй: `npm test` с `@testing-library/react` — мокай стор.
- Ошибки: Если не обновляется — console.log в actions. Версия Zustand >4.x.
- Расширение: Добавь фильтры по категории (новый action `setFilter`) или графики (Recharts + селекторы).


## Заключение

Zustand — идеальный старт для junior: простой, мощный, без лишнего. В Habit Tracker ты прокачал глобальное состояние (habits), persist (сохранение), devtools (дебаг) и actions (toggle/add/remove). Теперь попробуй добавить async-запросы к mock-API или slices — это следующий уровень! Если вопросы — пиши код в комментариях.

**Источники:** Официальная докa Zustand , примеры из Stack Overflow , этот проект.

[^1]: https://zustand.docs.pmnd.rs

[^2]: https://refine.dev/blog/zustand-react-state/

[^3]: https://stackoverflow.com/questions/75692454/zustand-is-not-updating-the-state

[^4]: https://github.com/pmndrs/zustand

[^5]: https://www.npmjs.com/package/zustand

[^6]: https://zustand.docs.pmnd.rs/guides/updating-state

[^7]: https://github.com/pmndrs/zustand/issues/244

[^8]: https://www.reddit.com/r/reactjs/comments/v5l6f5/zustand_how_does_it_work_how_does_it_cause_a/

[^9]: https://stackoverflow.com/questions/68183319/how-do-toggle-using-zustand

[^10]: HabitTracker.tsx

[^11]: https://zustand.docs.pmnd.rs/middlewares/persist

[^12]: https://zustand.docs.pmnd.rs/integrations/persisting-store-data

[^13]: https://zustand.docs.pmnd.rs/guides/prevent-rerenders-with-use-shallow

[^14]: https://github.com/pmndrs/zustand/discussions/2091

[^15]: https://github.com/pmndrs/zustand/discussions/1653

[^16]: https://reactnativeexpert.com/blog/mastering-zustand-in-react-native/

