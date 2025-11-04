import React from 'react';
import { uploadFile } from './services/upload.api';
import { saveMedia } from './services/media.api';
import { fetchHeroContent, saveHeroContent } from './services/impact.api';

function parseGradient(input: string | null | undefined): { degree: number; color1: string; color2: string } {
  const fallback = { degree: 180, color1: '#5038a0', color2: '#121242' };
  if (!input) return fallback;
  const m = input.match(/linear-gradient\((\d+)deg,\s*([^,]+),\s*([^\)]+)\)/i);
  if (!m) return fallback;
  const degree = Math.max(1, Math.min(360, Number(m[1]) || 180));
  const color1 = m[2].trim().split(' ')[0];
  const color2 = m[3].trim().split(' ')[0];
  return { degree, color1, color2 };
}

function composeGradient(degree: number, color1: string, color2: string): string {
  return `linear-gradient(${degree}deg, ${color1} 0%, ${color2} 100%)`;
}

export default function AdminUploadPage() {
  // Admin API key
  const [apiKey, setApiKey] = React.useState<string>('');

  // Hero basics
  const [title, setTitle] = React.useState<string>('');
  const [subtitle, setSubtitle] = React.useState<string>('');
  const [year, setYear] = React.useState<string>('');
  const [tagline, setTagline] = React.useState<string>('');
  const [bubblesCsv, setBubblesCsv] = React.useState<string>('');

  // Background media type (mutually exclusive)
  const [backgroundType, setBackgroundType] = React.useState<'image' | 'video'>('image');

  // Background image
  const [backgroundImage, setBackgroundImage] = React.useState<string | null>(null);
  const [backgroundImageAlt, setBackgroundImageAlt] = React.useState<string>('');

  // Gradient controls
  const [degree, setDegree] = React.useState<number>(180);
  const [color1, setColor1] = React.useState<string>('#5038a0');
  const [color2, setColor2] = React.useState<string>('#121242');

  // Overlay
  const [overlayColor, setOverlayColor] = React.useState<string>('#000000');
  const [overlayOpacity, setOverlayOpacity] = React.useState<number>(0);

  // Alignment/layout
  const [textAlign, setTextAlign] = React.useState<string>('center');
  const [layoutVariant, setLayoutVariant] = React.useState<string>('default');
  const [ariaLabel, setAriaLabel] = React.useState<string>('Impact report hero');

  // CTAs
  const [primaryLabel, setPrimaryLabel] = React.useState<string>('');
  const [primaryHref, setPrimaryHref] = React.useState<string>('');
  const [secondaryLabel, setSecondaryLabel] = React.useState<string>('');
  const [secondaryHref, setSecondaryHref] = React.useState<string>('');

  // Background video
  const [videoUrl, setVideoUrl] = React.useState<string>('');
  const [videoPoster, setVideoPoster] = React.useState<string>('');
  const [videoAutoplay, setVideoAutoplay] = React.useState<boolean>(false);
  const [videoLoop, setVideoLoop] = React.useState<boolean>(false);
  const [videoMuted, setVideoMuted] = React.useState<boolean>(true);

  // Media uploader (generic)
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<string>('');
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [savedId, setSavedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const hero = await fetchHeroContent();
      if (!hero) return;
      setTitle(hero.title ?? '');
      setSubtitle(hero.subtitle ?? '');
      setYear(hero.year ?? '');
      setTagline(hero.tagline ?? '');
      setBackgroundImage(hero.backgroundImage ?? null);
      const g = parseGradient(hero.backgroundColor as string | null);
      setDegree(g.degree);
      setColor1(g.color1);
      setColor2(g.color2);
      // @ts-expect-error overlay present on backend
      const overlay = (hero as any).overlay ?? null;
      if (overlay) {
        setOverlayColor(overlay.color ?? '#000000');
        setOverlayOpacity(typeof overlay.opacity === 'number' ? overlay.opacity : 0);
      }
      // @ts-expect-error bubbles present on backend
      const bubbles = (hero as any).bubbles as string[] | undefined;
      setBubblesCsv(Array.isArray(bubbles) ? bubbles.join(', ') : '');
      // @ts-expect-error
      const primary = (hero as any).primaryCta ?? {};
      setPrimaryLabel(primary.label ?? '');
      setPrimaryHref(primary.href ?? '');
      // @ts-expect-error
      const secondary = (hero as any).secondaryCta ?? {};
      setSecondaryLabel(secondary.label ?? '');
      setSecondaryHref(secondary.href ?? '');
      // @ts-expect-error
      const bgv = (hero as any).backgroundVideo ?? {};
      setVideoUrl(bgv.url ?? '');
      setVideoPoster(bgv.poster ?? '');
      setVideoAutoplay(Boolean(bgv.autoplay));
      setVideoLoop(Boolean(bgv.loop));
      setVideoMuted(Boolean(bgv.muted ?? true));
      // @ts-expect-error
      setTextAlign((hero as any).textAlign ?? 'center');
      // @ts-expect-error
      setLayoutVariant((hero as any).layoutVariant ?? 'default');
      setBackgroundImageAlt((hero as any).backgroundImageAlt ?? '');
      setAriaLabel((hero as any).ariaLabel ?? 'Impact report hero');

      // decide background type: prefer video if url present
      if (bgv && bgv.url) {
        setBackgroundType('video');
      } else if (hero.backgroundImage) {
        setBackgroundType('image');
      } else {
        setBackgroundType('image');
      }
    })();
  }, []);

  const onSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setSavedId(null);
    setStatus('');
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  };

  const onUpload = async () => {
    if (!file) return;
    setStatus('Uploading...');
    try {
      const { key, publicUrl } = await uploadFile(file, { folder: 'media' });
      setStatus('Saving to database...');
      const saved = await saveMedia({
        key,
        publicUrl,
        contentType: file.type,
        bytes: file.size,
      });
      setSavedId(String(saved.id));
      setStatus('Done');
    } catch (err) {
      setStatus('Failed');
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const uploadAndSet = async (
    kind: 'bgImage' | 'videoUrl' | 'videoPoster',
    fileInput: HTMLInputElement | null,
  ) => {
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) return;
    const f = fileInput.files[0];
    setStatus('Uploading...');
    try {
      const inferExt = () => {
        const byName = f.name.includes('.') ? (f.name.split('.').pop() || '').toLowerCase() : '';
        if (byName) return byName;
        if (f.type === 'image/jpeg' || f.type === 'image/jpg') return 'jpg';
        if (f.type === 'image/png') return 'png';
        if (f.type === 'image/webp') return 'webp';
        if (f.type === 'image/avif') return 'avif';
        if (f.type === 'image/gif') return 'gif';
        if (f.type === 'video/mp4') return 'mp4';
        if (f.type === 'video/quicktime') return 'mov';
        if (f.type === 'video/webm') return 'webm';
        return 'bin';
      };

      const ext = inferExt();
      const key = kind === 'bgImage'
        ? `media/hero/background.${ext}`
        : kind === 'videoUrl'
          ? `media/hero/video.${ext}`
          : `media/hero/video-poster.${ext}`;

      const { publicUrl } = await uploadFile(f, { key });
      if (kind === 'bgImage') {
        setBackgroundImage(publicUrl);
        // if switching to image via upload, enforce type and clear video
        setBackgroundType('image');
        setVideoUrl('');
        setVideoPoster('');
      }
      if (kind === 'videoUrl') {
        setVideoUrl(publicUrl);
        setBackgroundType('video');
        setBackgroundImage(null);
      }
      if (kind === 'videoPoster') {
        setVideoPoster(publicUrl);
        setBackgroundType('video');
        setBackgroundImage(null);
      }
      setStatus('Done');
    } catch (e) {
      setStatus('Failed');
    }
  };

  const onChangeBackgroundType: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const next = e.target.value as 'image' | 'video';
    setBackgroundType(next);
    if (next === 'image') {
      // clearing video fields
      setVideoUrl('');
      setVideoPoster('');
    } else {
      // clearing image field
      setBackgroundImage(null);
    }
  };

  const onSaveHero = async () => {
    const backgroundColor = composeGradient(degree, color1, color2);
    const bubbles = bubblesCsv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const backgroundImagePayload = backgroundType === 'image' ? (backgroundImage ?? null) : null;
    const backgroundVideoPayload = backgroundType === 'video'
      ? {
          url: videoUrl || null,
          poster: videoPoster || null,
          autoplay: videoAutoplay,
          loop: videoLoop,
          muted: videoMuted,
        }
      : null;

    const payload: Record<string, unknown> = {
      backgroundColor,
      backgroundImage: backgroundImagePayload,
      backgroundImageAlt: backgroundType === 'image' ? (backgroundImageAlt || null) : null,
      title,
      subtitle,
      year,
      tagline,
      bubbles,
      primaryCta: {
        label: primaryLabel || undefined,
        href: primaryHref || undefined,
      },
      secondaryCta: {
        label: secondaryLabel || undefined,
        href: secondaryHref || undefined,
      },
      backgroundVideo: backgroundVideoPayload,
      overlay: {
        color: overlayColor || null,
        opacity: overlayOpacity,
      },
      textAlign,
      layoutVariant,
      ariaLabel,
    };

    const saved = await saveHeroContent(payload, { apiKey });
    setStatus(saved ? 'Hero saved' : 'Failed to save hero');
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 16 }}>
      <h1>Admin</h1>
      <p>Upload media and edit hero content.</p>

      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <h2>Admin Auth</h2>
        <label>
          Admin API Key
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API key"
            style={{ width: '100%', marginTop: 4 }}
            title="Required to save hero (sent as X-API-Key)"
          />
        </label>
      </div>

      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <h2>Hero Basics</h2>
        <label>
          Title
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
        </label>
        <label style={{ display: 'block', marginTop: 12 }}>
          Subtitle
          <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
        </label>
        <label style={{ display: 'block', marginTop: 12 }}>
          Year
          <input type="text" value={year} onChange={(e) => setYear(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
        </label>
        <label style={{ display: 'block', marginTop: 12 }}>
          Tagline
          <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
        </label>
        <label style={{ display: 'block', marginTop: 12 }}>
          Bubbles (comma separated)
          <input type="text" value={bubblesCsv} onChange={(e) => setBubblesCsv(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
        </label>
      </div>

      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <h2>Background Gradient</h2>
        <div style={{ height: 60, borderRadius: 6, border: '1px solid #eee', background: composeGradient(degree, color1, color2), marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label title="Direction of the gradient in degrees (1–360). 0 = to right, 90 = down.">
            Degree
            <input
              type="number"
              min={1}
              max={360}
              value={degree}
              onChange={(e) => setDegree(Math.max(1, Math.min(360, Number(e.target.value) || 180)))}
              style={{ width: 100, marginLeft: 8 }}
            />
          </label>
          <label title="Start color of the gradient.">
            Color 1
            <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} style={{ marginLeft: 8 }} />
          </label>
          <label title="End color of the gradient.">
            Color 2
            <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} style={{ marginLeft: 8 }} />
          </label>
        </div>
      </div>

      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <h2>Overlay</h2>
        <label title="Overlay color placed above background (often black/white with transparency)." style={{ marginRight: 16 }}>
          Color
          <input type="color" value={overlayColor} onChange={(e) => setOverlayColor(e.target.value)} style={{ marginLeft: 8 }} />
        </label>
        <label title="Opacity from 0.0 to 1.0. Lower = more transparent; higher = more solid.">
          Opacity
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(Number(e.target.value))}
            style={{ marginLeft: 8, verticalAlign: 'middle' }}
          />
          <span style={{ marginLeft: 8 }}>{overlayOpacity.toFixed(2)}</span>
        </label>
      </div>

      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <h2>Background Media</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
          <label title="Use a static image as the background.">
            <input type="radio" name="bgType" value="image" checked={backgroundType === 'image'} onChange={onChangeBackgroundType} /> Image
          </label>
          <label title="Use a video as the background.">
            <input type="radio" name="bgType" value="video" checked={backgroundType === 'video'} onChange={onChangeBackgroundType} /> Video
          </label>
        </div>

        {backgroundType === 'image' ? (
          <div>
            {backgroundImage ? (
              <div style={{ marginBottom: 12 }}>
                <img src={backgroundImage} alt="bg" style={{ maxWidth: '100%', borderRadius: 6 }} />
              </div>
            ) : null}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <input type="file" accept="image/*" onChange={(e) => uploadAndSet('bgImage', e.target)} title="Upload a background image (optional)." />
              <button onClick={() => setBackgroundImage(null)}>Remove</button>
            </div>
            <label>
              Background Image Alt
              <input type="text" value={backgroundImageAlt} onChange={(e) => setBackgroundImageAlt(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
            </label>
          </div>
        ) : null}

        {backgroundType === 'video' ? (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <label style={{ flex: 1 }}>
                Video URL
                <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
              </label>
              <input type="file" accept="video/*" onChange={(e) => uploadAndSet('videoUrl', e.target)} title="Upload a background video (optional)." />
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <label style={{ flex: 1 }}>
                Poster URL
                <input type="text" value={videoPoster} onChange={(e) => setVideoPoster(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
              </label>
              <input type="file" accept="image/*" onChange={(e) => uploadAndSet('videoPoster', e.target)} title="Upload a poster image (optional)." />
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <label>
                <input type="checkbox" checked={videoAutoplay} onChange={(e) => setVideoAutoplay(e.target.checked)} /> Autoplay
              </label>
              <label>
                <input type="checkbox" checked={videoLoop} onChange={(e) => setVideoLoop(e.target.checked)} /> Loop
              </label>
              <label title="Recommended ON for background videos to avoid unexpected audio.">
                <input type="checkbox" checked={videoMuted} onChange={(e) => setVideoMuted(e.target.checked)} /> Muted
              </label>
            </div>
          </div>
        ) : null}
      </div>

      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <h2>CTAs</h2>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <label style={{ flex: 1 }}>
            Primary Label
            <input type="text" value={primaryLabel} onChange={(e) => setPrimaryLabel(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
          </label>
          <label style={{ flex: 1 }}>
            Primary Href
            <input type="text" value={primaryHref} onChange={(e) => setPrimaryHref(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
          </label>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ flex: 1 }}>
            Secondary Label
            <input type="text" value={secondaryLabel} onChange={(e) => setSecondaryLabel(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
          </label>
          <label style={{ flex: 1 }}>
            Secondary Href
            <input type="text" value={secondaryHref} onChange={(e) => setSecondaryHref(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
          </label>
        </div>
      </div>

      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <h2>Accessibility</h2>
        <label style={{ display: 'block', marginBottom: 12 }}>
          ARIA Label
          <input type="text" value={ariaLabel} onChange={(e) => setAriaLabel(e.target.value)} style={{ width: '100%', marginTop: 4 }} title="Short description for screen readers." />
        </label>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <button onClick={onSaveHero}>Save Hero</button>
        <span>{status}</span>
      </div>

      <div style={{ border: '1px dashed #ddd', padding: 16, borderRadius: 8 }}>
        <h2>Generic Media Upload (optional)</h2>
        <p>Select a photo or video to upload to storage and save to MongoDB.</p>
        <input type="file" onChange={onSelect} />
        {file ? (
          <div style={{ marginTop: 16 }}>
            <div>File: {file.name} ({Math.round(file.size / 1024)} KB)</div>
            <button onClick={onUpload} style={{ marginTop: 8 }}>Upload</button>
          </div>
        ) : null}
        {status ? <div style={{ marginTop: 16 }}>Status: {status}</div> : null}
        {previewUrl && file?.type.startsWith('image/') ? (
          <div style={{ marginTop: 16 }}>
            <img src={previewUrl} alt="preview" style={{ maxWidth: '100%' }} />
          </div>
        ) : null}
        {previewUrl && file?.type.startsWith('video/') ? (
          <div style={{ marginTop: 16 }}>
            <video src={previewUrl} controls style={{ width: '100%' }} />
          </div>
        ) : null}
        {savedId ? (
          <div style={{ marginTop: 16 }}>
            Saved document id: {savedId}
          </div>
        ) : null}
      </div>
    </div>
  );
}
