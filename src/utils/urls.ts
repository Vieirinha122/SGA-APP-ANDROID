import { PageKey } from "../types/types";
import { BASE_URL } from "./constants";

export default function buildUrl(page: PageKey, token: string): string {
  const trimmed = token.trim();

  // Se o "token" já for uma URL completa, usa ela diretamente (mesmo
  // comportamento do main.js original)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  let url = `${BASE_URL}/${page}`;
  if (trimmed) {
    url += `?token=${encodeURIComponent(trimmed)}`;
  }
  return url;
}

export function getPainelUrl(token: string): string {
  return buildUrl("painel", token);
}
