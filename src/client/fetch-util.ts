export const fetchSiteinfo = async (url: string) => {
  const res = await fetch(
    `/api/fetch-site-info?url=${encodeURIComponent(url)}`,
  );
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json?.error || "解析图标失败,状态码: " + res.status);
  }
  return res.json();
};
