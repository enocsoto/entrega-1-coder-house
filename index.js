import { Server } from './src/server/app.js';
const PORT = process.env.PORT || 3000;
const app = new Server();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
