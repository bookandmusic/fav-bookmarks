export const fetchSiteinfo = async (url: string) => {
  const response = await fetch(
    `/api/fetch-site-info?url=${encodeURIComponent(url)}`
  );
  if (!response.ok) {
    const json = await response.json();
    throw new Error(json?.error || '解析图标失败,状态码: ' + response.status);
  }
  return response.json();
};
