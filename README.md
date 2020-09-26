# Todo #
Приложение для ведения личных заметок

### Особенность ###
* Добавлена возможность регистрации пользователей.
* Создание для каждого пользователя отдельного списка дел.

### Реализовано ###
* На серверной стороне реализована регистрация нового пользователя, логин и логаут.
* Получение, создание, удаление задания из списка, обновление о выполнении задания.
* Приложение работает с БД MYSQL по средствам ORM sequelize.
* Защита пользовательских сессий от CSRF атак.