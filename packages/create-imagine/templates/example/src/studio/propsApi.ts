import { emptyPropsFile, validatePropsFileV1, type PropsFileV1 } from '../core/manifest';

function propsUrl(projectId: string): string {
  const u = new URL('/__imagine/props', window.location.origin);
  u.searchParams.set('projectId', projectId);
  return u.toString();
}

export async function fetchPropsFile(projectId: string): Promise<PropsFileV1> {
  const res = await fetch(propsUrl(projectId), { method: 'GET' });
  if (!res.ok) throw new Error(`GET props failed: ${res.status} ${res.statusText}`);
  const json = await res.json();
  return validatePropsFileV1(json);
}

export async function savePropsFile(projectId: string, file: PropsFileV1): Promise<void> {
  const res = await fetch(propsUrl(projectId), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(file)
  });
  if (!res.ok) throw new Error(`POST props failed: ${res.status} ${res.statusText}`);
}

export { emptyPropsFile };

