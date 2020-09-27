const { param } = require("../routs/todo");

new Vue({
    el: '#app',
    data() {
        return {
            isDark: true,
            show: true,
            todoTitle: '',
            todos: []
        };
    },
    created() {
        
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)x-csrf-token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        fetch('/api/todo', {
            method: 'GET',
            headers: {
                'x-csrf-token': token // <-- is the csrf token as a header
              },
        })
            .then(res => res.json())
            .then((todos) => {
                this.todos = todos;
            })
            .catch(e => console.log(e));
    },
    methods: {
        addTodo() {
            const title = this.todoTitle.trim();
            if (!title) {
                return;
            }
            const token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
            
            fetch('/api/todo', {
                method: 'post',
                body: JSON.stringify({ title }),
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': token
                },
            })
                .then(res => res.json())
                .then((todo) => {
                    this.todos.push(todo);
                    this.todoTitle = '';
                })
                .catch(e => console.log(e));
        },
        completeTodo(id) {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)_csrf\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            fetch('/api/todo/' + id, {
                method: 'put',
                body: JSON.stringify({ done: true }),
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': token
                },
            })
                .then(res => res.json())
                .then((todo) => {
                    const idx = this.todos.findIndex(t => t.id == todo.id);
                    this.todos[idx].updatedAt = todo.updatedAt;
                })
                .catch(e => console.log(e));
        },
        removeTodo(id) {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)_csrf\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            fetch('/api/todo/' + id, {
                method: 'delete',
                body: JSON.stringify({ id }),
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': token
                }
            })
                .then(() => {
                    this.todos = this.todos.filter(t => t.id != id);
                })
                .catch(e => console.log(e));
            this.todos = this.todos.filter(t => t.id !== id);
        }
    },
    filters: {
        capitalize(value) {
            return value.toString().charAt(0).toUpperCase() + value.slice(1);
        },
        date(value, withTime) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            };
            if (withTime) {
                options.hour = '2-digit';
                options.minute = '2-digit';
                options.second = '2-digit';
            }
            return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value));
        }
    }
});
