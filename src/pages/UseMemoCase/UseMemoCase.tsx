import { useState, useMemo } from 'react'

function UseMemoCase() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'firstName') {
            setFirstName(value)
        } else if (name === 'lastName') {
            setLastName(value)
        }
    }

    // Неоправданное дорогое использование UseMemo
    const fullName = useMemo(() => {
        return `${firstName} ${lastName}`
    }, [firstName, lastName])

    // Лучше вычислить fullName напрямую в теле компонента без хука: это упростит код,
    // устранит ненужные зависимости и сохранит производительность,
    // так как React перерендерит компонент только при изменении состояний.
    // const fullName = `${firstName} ${lastName}`

    return (
        <div>
            <h2>UseMemo Case</h2>
            <h4>Введите имя и фамилию</h4>
            <div>
                <input name='firstName' value={firstName} onChange={handleChange} placeholder='Имя' />
                <input name='lastName' value={lastName} onChange={handleChange} placeholder='Фамилия' />
                <p>Полное имя: {fullName}</p>
            </div>
            <h1>***</h1>
            <div>
                useMemo представлен для демонстрации: оно предотвращает ненужные перевычисления при ререндерах, хотя для
                такой простой операции эффект минимален
            </div>
            <div>
                <h1>Почему useMemo не оправдано</h1>
                <p>
                    В данном компоненте useMemo для fullName не оправдан, поскольку конкатенация двух строк — это
                    тривиальное вычисление, которое React выполняет быстрее, чем проверяет зависимости хука. Overhead от
                    useMemo (проверка массива зависимостей) может даже замедлить рендер, особенно в простом сценарии без
                    дорогих операций или частых перерендеров. Для демонстрации хука оно подходит, но в реальном коде
                    такая оптимизация преждевременна и усложняет чтение.​
                </p>

                <h3>Как сделать лучше</h3>
                <p>
                    Лучше вычислить fullName напрямую в теле компонента без хука: это упростит код, устранит ненужные
                    зависимости и сохранит производительность, так как React перерендерит компонент только при изменении
                    состояний. Просто замените useMemo на const fullName = ${firstName} ${lastName}; перед return —
                    значение пересчитается только при необходимости. Это стандартный подход для легких вычислений,
                    избегающий переоптимизации и улучшающий читаемость.​
                </p>

                <h3>useEffect как альтернатива</h3>
                <p>
                    useEffect не лучше для этого случая, поскольку предназначен для побочных эффектов (например,
                    API-запросы, подписки), а не для вычислений, используемых в JSX во время рендера. Если применить
                    useEffect, значение fullName станет доступно только после рендера (в состоянии), что приведет к
                    задержке в UI и лишнему состоянию, усложняя логику. Используйте useEffect только если нужно
                    реагировать на изменения (например, логировать полное имя), но для отображения прямое вычисление или
                    useMemo предпочтительнее.
                </p>
            </div>
        </div>
    )
}

export default UseMemoCase
