const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://ixjdjvkktlzgiyojnsto.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Qb66X-cvzAckaQev2ku1VA__CoLmIB1';
const SCHEMA = 'anish-portfolio';

async function request(table, params = '') {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${params}`, {
    headers: { apikey: SUPABASE_KEY, 'Accept-Profile': SCHEMA }
  });
  if (!response.ok) throw new Error(`Supabase request failed: ${response.status} ${await response.text()}`);
  return response.json();
}

export const isExternalVideoUrl = value => /^https?:\/\//i.test(String(value || '').trim());

export const isGoogleDriveVideoUrl = value => /drive\.google\.com/i.test(String(value || ''));

export const getGoogleDrivePreviewUrl = value => {
  const raw = String(value || '').trim();
  const match = raw.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview?autoplay=1`;
  const id = raw.match(/[?&]id=([^&#]+)/i);
  if (id) return `https://drive.google.com/file/d/${id[1]}/preview?autoplay=1`;
  return raw;
};

export const getVideoUrl = value => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (isGoogleDriveVideoUrl(raw)) return getGoogleDrivePreviewUrl(raw);
  return isExternalVideoUrl(raw) ? raw : `${raw}.mp4`;
};

export const getVideoPoster = value => {
  const raw = String(value || '').trim();
  return isExternalVideoUrl(raw) ? undefined : `${raw}.webp`;
};

export const getBlogs = () => request('blog', '?select=slug,title,content&order=sort_order.asc');
export const getProjects = () => request('project', '?select=title,slug,category,video_src,is_external_link,has_blob,show_carousel,is_vertical,description&order=sort_order.asc').then(rows => rows.map(row => ({ title: row.title, slug: row.slug, category: row.category, videoSrc: row.video_src, isExternalLink: row.is_external_link, hasBlob: row.has_blob, showCarousel: row.show_carousel, isVertical: row.is_vertical, description: row.description })));
export const getWritings = () => request('writing', '?select=external_id,title,url&order=sort_order.asc');
export const getProjectBySlug = async slug => { const projects = await getProjects(); return projects.find(project => project.slug === slug) || projects[0] || null; };
export { SUPABASE_URL, SUPABASE_KEY };
