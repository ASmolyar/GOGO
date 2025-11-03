## Impact Report API

### Environment

Create a `.env` file in this directory with the following values (fill in the URI later):

```
MONGO_URI=mongodb://localhost:27017/gogo-impact-report
MONGO_DB_NAME=gogo-impact-report
PORT=4000
```

### Scripts

- `npm run dev` – start the API with hot-reload via `ts-node-dev`
- `npm run build` – compile TypeScript to `dist/`
- `npm start` – run the compiled JavaScript from `dist/`

The API exposes `GET /api/impact/hero?slug=impact-report`, which returns the hero payload expected by the frontend.

