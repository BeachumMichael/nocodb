import cors from 'cors';
import express from 'express';
import Noco from '~/Noco';

const server = express();
server.enable('trust proxy');
server.disable('etag');
server.disable('x-powered-by');

// Allow specific origin or dynamically reflect any
const allowedOrigin = process.env.NC_CORS_ORIGIN;

server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, false); // disallow non-browser requests
      if (allowedOrigin) return callback(null, allowedOrigin);
      return callback(null, origin); // fallback: reflect request origin
    },
    credentials: true,
    exposedHeaders: 'xc-db-response',
  }),
);

server.set('view engine', 'ejs');

async function bootstrap() {
  const httpServer = server.listen(process.env.PORT || 8080, async () => {
    server.use(await Noco.init({}, httpServer, server));
  });
}

bootstrap();
