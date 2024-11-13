const { server } = require('./app')

// Change the port number to listen to a different port but remember to change the port number in frontend too!
server.listen(3004, () => {
    console.log("Collab Service is Running on port 3004")
})
