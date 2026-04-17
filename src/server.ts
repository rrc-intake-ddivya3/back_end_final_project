import "dotenv/config";
import app from "./app";
import { Server } from "http";

// 4000 avoids common conflicts on 3000-3001
const PORT: number = Number(process.env.PORT) || 4000;

const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
        console.error(
            `Port ${PORT} is already in use. Stop the other process (see netstat) or set PORT in .env.`,
        );
    } else {
        console.error(err);
    }
    process.exit(1);
});

// Helps some Windows + npm setups where stdin closing would end the process.
process.stdin.resume();

export { server };