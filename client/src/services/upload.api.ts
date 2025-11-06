export interface SignUploadResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  expiresInSeconds: number;
}

export interface SignUploadRequest {
  contentType: string;
  extension?: string;
  folder?: string;
  key?: string;
}

const DEFAULT_BACKEND_URL = 'http://localhost:4000';
const API_BASE_URL =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? DEFAULT_BACKEND_URL;

export async function signUpload(
  payload: SignUploadRequest,
): Promise<SignUploadResponse> {
  console.log("[client][upload] sign request", payload);
  const res = await fetch(`${API_BASE_URL}/api/uploads/sign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to sign upload');
  }
  const json = (await res.json()) as SignUploadResponse;
  console.log("[client][upload] sign response", {
    key: json.key,
    publicUrl: json.publicUrl,
    expiresInSeconds: json.expiresInSeconds,
  });
  return json;
}

export async function uploadToSignedUrl(args: {
  uploadUrl: string;
  file: File | Blob;
  contentType?: string;
}): Promise<Response> {
  const { uploadUrl, file, contentType } = args;
  console.log("[client][upload] PUT to signed URL", {
    size: (file as File).size ?? undefined,
    contentType,
  });
  return fetch(uploadUrl, {
    method: 'PUT',
    headers: contentType ? { 'Content-Type': contentType } : undefined,
    body: file,
  });
}

export async function uploadFile(
  file: File,
  options?: { folder?: string; key?: string },
): Promise<{ key: string; publicUrl: string }>
{
  console.log("[client][upload] start", {
    name: file.name,
    size: file.size,
    type: file.type,
    options,
  });
  const extension = file.name.includes('.')
    ? file.name.split('.').pop() ?? undefined
    : undefined;

  const signed = await signUpload({
    contentType: file.type,
    extension,
    folder: options?.folder,
    key: options?.key,
  });

  const putRes = await uploadToSignedUrl({
    uploadUrl: signed.uploadUrl,
    file,
    contentType: file.type,
  });

  if (!putRes.ok) {
    console.error("[client][upload] PUT failed", {
      status: putRes.status,
      statusText: putRes.statusText,
    });
    throw new Error('Failed to upload to storage');
  }

  console.log("[client][upload] success", {
    key: signed.key,
    publicUrl: signed.publicUrl,
  });
  return { key: signed.key, publicUrl: signed.publicUrl };
}
