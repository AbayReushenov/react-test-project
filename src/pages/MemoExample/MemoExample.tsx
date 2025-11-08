import { useState, useMemo } from 'react';

function MemoExample() {
    const [count, setCount] = useState(0);
     const [todos, setTodos] = useState<string[]>([]); // Явный тип: массив строк

    // Симуляция дорогого вычисления: сумма от 1 до n с циклом
    const expensiveValue = useMemo(() => {
        console.log('Вычисление выполнено'); // Лог для демонстрации: выводится только при изменении count
        let sum = 0;
        for (let i = 0; i <= count * 1000; i++) { // Имитация тяжелой операции
            sum += i;
        }
        return sum;
    }, [count]); // Зависимость только от count

    const addTodo = () => {
        setTodos([...todos, `Todo ${todos.length + 1}`]);
    };

    return (
        <div>
            <h2>Пример useMemo</h2>
            <p>Значение: {expensiveValue}</p>
            <p>Смотрите логи! Лог для демонстрации: выводится только при изменении count</p>
            <button onClick={() => setCount(count + 1)}>Увеличить count ({count})</button>
            <button onClick={addTodo}>Добавить todo ({todos.length})</button>
            <ul>{todos.map((todo, index) => <li key={index}>{todo}</li>)}</ul>
        </div>
    );
}

export default MemoExample;
