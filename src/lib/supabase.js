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

// Accept the existing local video paths exactly as before, while also accepting
// external video URLs. Google Drive share links are converted to a browser-playable
// download URL so the same HTML5 video player can be used.
export const isExternalVideoUrl = value => /^https?:\/\//i.test(String(value || '').trim());

export const getVideoUrl = value => {
  const raw = String(value || '').trim();
  if (!raw) return '';

  const driveMatch = raw.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
  }

  // Also accept the Google Drive uc/open form if an ID is supplied.
  const driveId = raw.match(/[?&]id=([^&#]+)/i);
  if (/drive\.google\.com/i.test(raw) && driveId) {
    return `https://drive.google.com/uc?export=download&id=${driveId[1]}`;
  }

  // Existing portfolio values are base paths such as /project-name/video.
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
