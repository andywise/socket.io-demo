const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

var screen

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/screen.html')
})
app.get('/r', (req, res) => {
    res.sendFile(__dirname + '/remote.html')
})

io.on('connection', (socket) => {
    console.log(`${socket.id} connected!`)
    socket.emit('hello', {hello: 'world'})
    socket.on('hello yourself', (data) => {
        console.log(data)
    })

    socket.on('registerScreen', (data) => {
        screen = {}
        screen.id = socket.id
    })

    socket.on('sendToScreen', (data) => {
        io.to(screen.id).emit('fromRemote', data)// relay from remote to screen!
    })

    socket.on('changeColor', () => {
        io.to(screen.id).emit('remoteWantsNewColor', socket.id)
    })

    socket.on('disconnect', (data) => {
        console.log(`${socket.id} disconnected. :(`)
    })

    socket.on('thanks', (data) => {
        io.to(data).emit('thanks', socket.id)
    })
})

server.listen(3000)