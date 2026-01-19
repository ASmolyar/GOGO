import { API_BASE_URL } from './apiConfig';

export interface SaveMediaRequest {
  key: string;
  publicUrl: string;
  contentType?: string;
  bytes?: number;
  width?: number;
  height?: number;
  duration?: number;
  alt?: string;
  tag?: string;
  entityType?: string;
  entityId?: string | number;
}

export interface SaveMediaResponse {
  id: string;
  data: Record<string, unknown>;
}

export async function saveMedia(payload: SaveMediaRequest): Promise<SaveMediaResponse> {
  const res = await fetch(`${API_BASE_URL}/api/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to save media');
  }
  return (await res.json()) as SaveMediaResponse;
}
