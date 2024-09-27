const app = require('./app')

// Change the port number to listen to a different port but remember to change the port number in frontend too!
app.listen(3001, () => {
    console.log("Server is Running")
})
