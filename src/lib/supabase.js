const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://ixjdjvkktlzgiyojnsto.supabase.co';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || ['sb_','publishable_','Qb66X-cvzAckaQev2ku1VA__CoLmIB1'].join('');
const SCHEMA = 'anish-portfolio';

async function request(table, params = '') {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${params}`, {
    headers: { apikey: SUPABASE_KEY, 'Accept-Profile': SCHEMA }
  });
  if (!response.ok) throw new Error(`Supabase request failed: ${response.status} ${await response.text()}`);
  return response.json();
}

const cleanVideoValue = value => String(value || '').trim();

export const isExternalVideoUrl = value => /^https?:\/\//i.test(cleanVideoValue(value));

export const isGoogleDriveVideoUrl = value => {
  const raw = cleanVideoValue(value);
  return /(?:drive|docs)\.google\.com/i.test(raw) || /^[A-Za-z0-9_-]{20,100}$/.test(raw);
};

export const getGoogleDriveFileId = value => {
  const raw = cleanVideoValue(value);
  const match = raw.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  if (match) return decodeURIComponent(match[1]);
  const openMatch = raw.match(/(?:drive\.google\.com\/open|drive\.google\.com\/uc)[^#]*[?&]id=([^&#]+)/i);
  if (openMatch) return decodeURIComponent(openMatch[1]);
  const id = raw.match(/[?&]id=([^&#]+)/i);
  if (id) return decodeURIComponent(id[1]);
  return /^[A-Za-z0-9_-]{20,100}$/.test(raw) ? raw : '';
};

export const getGoogleDrivePreviewUrl = value => {
  const id = getGoogleDriveFileId(value);
  return id ? `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview?autoplay=1&mute=1&controls=0` : cleanVideoValue(value);
};

export const getGoogleDriveDirectUrl = value => {
  const raw = cleanVideoValue(value);
  const id = getGoogleDriveFileId(raw);
  if (!id) return '';

  // Use Google's public download endpoint directly so Drive videos do not
  // depend on a Supabase Edge Function. This URL can be consumed by the
  // native HTML <video> element just like a normal remote MP4 when the
  // Drive file is shared publicly.
  try {
    const url = new URL(raw);
    const resourceKey = url.searchParams.get('resourcekey');
    const suffix = resourceKey ? '&resourcekey=' + encodeURIComponent(resourceKey) : '';
    return 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(id) + suffix;
  } catch {
    return 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(id);
  }
};

const getYouTubeId = raw => {
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || '';
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2] || '';
      if (url.pathname.startsWith('/embed/')) return url.pathname.split('/')[2] || '';
      return url.searchParams.get('v') || '';
    }
  } catch {}
  return '';
};

const getVimeoId = raw => {
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const match = url.pathname.match(/(?:video\/)?(\d+)/);
      return match ? match[1] : '';
    }
  } catch {}
  return '';
};

/*
 * GitHub Pages serves this app from /anishP/.
 * Admin users can enter either:
 *   content/video.mp4
 *   /content/video.mp4
 *   https://example.com/video.mp4
 *   Google Drive / YouTube / Vimeo URLs
 * Local paths are resolved through PUBLIC_URL so they work on nested
 * GitHub Pages routes such as /anishP/portfolio/project-name.
 */
const getLocalAssetUrl = value => {
  const raw = cleanVideoValue(value);
  if (!raw || isExternalVideoUrl(raw)) return raw;
  const base = String(process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const path = raw.replace(/^\/+/, '');
  if (base && (raw === base || raw.startsWith(`${base}/`))) return raw;
  return `${base}/${path}`;
};

export const getVideoUrl = value => {
  const raw = cleanVideoValue(value);
  if (!raw) return '';
  if (isGoogleDriveVideoUrl(raw)) return getGoogleDrivePreviewUrl(raw);
  if (isExternalVideoUrl(raw)) return raw;
  const path = raw.endsWith('.mp4') ? raw : `${raw}.mp4`;
  return getLocalAssetUrl(path);
};

export const isDirectVideoUrl = value => {
  const raw = cleanVideoValue(value);
  if (!raw) return false;
  if (isGoogleDriveVideoUrl(raw)) return false;
  if (!isExternalVideoUrl(raw)) return true;
  try {
    const url = new URL(raw);
    const pathname = url.pathname.toLowerCase();
    return /\.(mp4|webm|ogg|ogv|mov|m4v|avi|m3u8|mpd)(?:$|\/)/i.test(pathname);
  } catch {
    return false;
  }
};

export const getVideoEmbedUrl = value => {
  const raw = cleanVideoValue(value);
  if (!raw) return '';
  if (isGoogleDriveVideoUrl(raw)) return getGoogleDrivePreviewUrl(raw);

  const youtubeId = getYouTubeId(raw);
  if (youtubeId) return `https://www.youtube.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&mute=1&rel=0`;

  const vimeoId = getVimeoId(raw);
  if (vimeoId) return `https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}?autoplay=1&muted=1`;

  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');

    if (host === 'dailymotion.com' || host === 'dai.ly') {
      const match = host === 'dai.ly'
        ? url.pathname.split('/').filter(Boolean)[0]
        : url.pathname.match(/\/video\/([^_/?#]+)/i)?.[1];
      if (match) return `https://www.dailymotion.com/embed/video/${encodeURIComponent(match)}?autoplay=1&mute=1`;
    }

    if (host === 'loom.com') {
      const id = url.pathname.match(/\/share\/([A-Za-z0-9]+)/i)?.[1] || url.pathname.match(/\/embed\/([A-Za-z0-9]+)/i)?.[1];
      if (id) return `https://www.loom.com/embed/${id}?autoplay=1&muted=1`;
    }

    if (host === 'wistia.com' || host.endsWith('.wistia.com')) {
      const id = url.pathname.match(/\/medias\/([A-Za-z0-9]+)/i)?.[1];
      if (id) return `https://fast.wistia.net/embed/iframe/${id}?autoPlay=true&muted=true`;
    }
  } catch {}

  return raw;
};

export const getVideoPoster = value => {
  const raw = cleanVideoValue(value);
  if (isExternalVideoUrl(raw)) return undefined;
  const videoPath = raw.endsWith('.mp4') ? raw : `${raw}.mp4`;
  return getLocalAssetUrl(videoPath.replace(/\.mp4$/i, '.webp'));
};

export const getBlogs = () => request('blog', '?select=slug,title,content&order=sort_order.asc');
export const getProjects = () => request('project', '?select=title,slug,category,video_src,is_external_link,has_blob,show_carousel,is_vertical,description&order=sort_order.asc').then(rows => rows.map(row => ({ title: row.title, slug: row.slug, category: row.category, videoSrc: row.video_src, isExternalLink: row.is_external_link, hasBlob: row.has_blob, showCarousel: row.show_carousel, isVertical: row.is_vertical, description: row.description })));
export const getWritings = () => request('writing', '?select=external_id,title,url&order=sort_order.asc');
export const getProjectBySlug = async slug => { const projects = await getProjects(); return projects.find(project => project.slug === slug) || projects[0] || null; };
export { SUPABASE_URL, SUPABASE_KEY };
