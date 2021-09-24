// Projeto Colearning: TO-DO

const { request, response } = require('express');
var express = require('express');
const moment = require('moment');
const { v4 } = require("uuid")

var app = express();

app.use(express.json())


// Criar de um usuário com name e username

const usuarios = []

app.post ("/users", (request, response) => {
    const {name, username} = request.body
    const usuario = {userid: v4(), name, username, todos: []}
    usuarios.push(usuario)
    return response.json(usuario)
})

// Listar os Usuários
app.get("/users", (request, response) => {
    return response.json(usuarios)
})


// Criar um novo TO-DO

allToDos = []

app.post("/todo", (request, response) => {
    const {userid, title, deadline} = request.body
    const todo = {todoid: v4(), title, done: false, deadline, created_at: moment()}
    userIndex = usuarios.findIndex( element => element.userid == userid)
    allToDos.push(todo)
    if(userIndex < 0) {
        return response.status(400).json({error: "Usuário não encontrado"})
    }
    usuarios[userIndex].todos.push(todo)
    return response.json(usuarios[userIndex])
})


// Listar todos os TO-DOs

app.get("/todo", (request, response) => {
    return response.json(allToDos)
})


// Alterar o title e deadline de um todo existente
// Aparentemente está dando certo agora, mas não entendo como alterar um item na lista dos TO-DOs altera a lista do usuário 
//também

app.put("/todo/:todoid", (request, response) => {
    const { todoid } = request.params
    const { title, deadline} = request.body
    
    todoIndex = allToDos.findIndex( element => element.todoid == todoid)
    if (todoIndex < 0) {
        return response.status(400).json({error: "ToDo não encontrado"})
    }
    
    allToDos[todoIndex].title = title
    allToDos[todoIndex].deadline = deadline

    return response.json(allToDos)
})


// Marcar um TO-DO como feito
// Imagino que está dando conflito com o outro PUT
// Usando o PATCH funciona como deveria funcionar (22/09)

app.patch ("/todo/:todoid", (request,response) => {
    const { todoid } = request.params

    todoIndex = allToDos.findIndex( element => element.todoid == todoid)
    if (todoIndex < 0) {
        return response.status(400).json({error: "ToDo não encontrado"})
    }

    allToDos[todoIndex].done = true

    return response.json(allToDos)
})


// Excluir um TO-DO
// Deleta do allToDos, mas não deleta do usuário. Preciso ver com Bruno. Com o for, deleta das duas listas, o que está correto. MAS, pq funciona no outro direto e aqui precisa do FOR?

app.delete ("/todo/:todoid", (request, response) => {
    const {todoid} = request.params
 
    todoIndex = allToDos.findIndex( element => element.todoid == todoid)
    if (todoIndex < 0) {
        return response.status(400).json({error: "ToDo não encontrado"})
    }
  
    allToDos.splice(todoIndex, 1)

    for (element of usuarios) {
        for (element2 of element.todos) {
            if (element2.todoid == todoid) {
                let i = element.todos.findIndex( element => element.todoid === todoid)
                element.todos.splice(i, 1)
            }
        }
    }

    return response.json(allToDos)
})




app.listen(4000)