## Impact Report API

### Environment

Create a `.env` file in this directory with the following values (fill in the URI later):

```
MONGO_URI=mongodb://localhost:27017/gogo-impact-report
MONGO_DB_NAME=gogo-impact-report
PORT=4000

# Upload signing (S3 or compatible)
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
# Public base for served media (CDN recommended)
CDN_BASE_URL=https://cdn.example.com
```

If running locally with AWS:

```
# Avoid committing real secrets
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

### Scripts

- `npm run dev` – start the API with hot-reload via `ts-node-dev`
- `npm run build` – compile TypeScript to `dist/`
- `npm start` – run the compiled JavaScript from `dist/`

The API exposes `GET /api/impact/hero?slug=impact-report`, which returns the hero payload expected by the frontend.

### Uploads

- `POST /api/uploads/sign` – returns a presigned URL for direct upload to object storage.
  - Request JSON: `{ "contentType": string, "extension?": string, "folder?": string }`
  - Response JSON: `{ uploadUrl, key, publicUrl, expiresInSeconds }`

Flow:
1. Client requests a signed URL with file content type.
2. Client uploads the file via `PUT` to `uploadUrl` (with `Content-Type`).
3. Client saves `{ key, publicUrl }` and metadata in MongoDB as needed.

