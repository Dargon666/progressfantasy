export function encodeSave(data) {
  const json = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(json))); // Base64 encode
}

export function decodeSave(base64) {
  const json = decodeURIComponent(escape(atob(base64)));
  return JSON.parse(json);
}
