# Трекер привычек

# Для тестов используйте смену системного времени

### Команды для управления системным временем в Ubuntu 24.04:

## Установка нового системного времени

```bash
# Установка времени вручную (замените на нужное время)
sudo timedatectl set-time "2024-01-15 14:30:00"

# Или установка только времени без даты
sudo timedatectl set-time "14:30:00"
```

## Рестарт/перезапуск службы времени

```bash
# Перезапуск службы systemd-timesyncd
sudo systemctl restart systemd-timesyncd

# Если используете chrony:
sudo systemctl restart chronyd

# Если используете ntp:
sudo systemctl restart ntp
```

## Полезные команды для работы со временем

```bash
# Просмотр текущих настроек времени
timedatectl status

# Включение синхронизации времени с NTP серверами
sudo timedatectl set-ntp true

# Выключение синхронизации времени
sudo timedatectl set-ntp false

# Установка временной зоны
sudo timedatectl set-timezone Europe/Moscow
```

## Дополнительные опции

```bash
# Принудительная синхронизация времени (если используется systemd-timesyncd)
sudo timedatectl set-ntp false
sudo timedatectl set-ntp true

# Проверка синхронизации времени
timedatectl timesync-status
```

Выберите команды в зависимости от того, какая служба времени используется в вашей системе (проверить можно командой `timedatectl status`).
