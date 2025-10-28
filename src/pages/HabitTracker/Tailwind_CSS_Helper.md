# В Tailwind CSS есть несколько способов сделать блок "липким" (sticky) при скролле. Вот основные варианты:

## 1. **Sticky позиционирование** (самый простой способ)

```html
<div class="sticky top-0">
  <!-- Ваш контент -->
  Этот блок будет прилипать к верху при скролле
</div>
```

## 2. **С дополнительными настройками**

```html
<!-- Прилипает к верху и поверх другого контента -->
<div class="sticky top-0 z-50 bg-white p-4 shadow">
  <!-- Ваш контент -->
</div>

<!-- С отступом от верха -->
<div class="sticky top-4">
  <!-- Ваш контент -->
</div>
```

## 3. **Пример с навигацией**

```html
<nav class="sticky top-0 z-50 bg-blue-600 text-white p-4">
  <div class="container mx-auto">
    <ul class="flex space-x-4">
      <li><a href="#home">Главная</a></li>
      <li><a href="#about">О нас</a></li>
      <li><a href="#contact">Контакты</a></li>
    </ul>
  </div>
</nav>
```

## 4. **Sticky sidebar**

```html
<div class="flex">
  <div class="w-3/4">
    <!-- Основной контент (скроллится) -->
  </div>

  <div class="w-1/4">
    <div class="sticky top-4">
      <!-- Боковая панель (прилипает) -->
      Sidebar content
    </div>
  </div>
</div>
```

## Ключевые классы:

- `sticky` - включает sticky позиционирование
- `top-0` - прилипает к верху (можно использовать `top-2`, `top-4` и т.д.)
- `z-50` - устанавливает z-index для поверхностного отображения
- `bg-white` - фон (важно для перекрытия контента под ним)

**Важно:** Sticky работает только когда есть место для скролла, и родительский контейнер не должен иметь `overflow-hidden`.
