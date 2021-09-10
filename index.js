const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
    
    // ME
	socket.emit("me", socket.id);

    // DISCONNECTING
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

    // CALLING OTHERS
	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

    // ANSWERING OTHERS
	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});

});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));