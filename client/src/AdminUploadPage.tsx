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
  // Admin API key removed

  // Hero basics
  const [title, setTitle] = React.useState<string>('');
  const [subtitle, setSubtitle] = React.useState<string>('');
  const [year, setYear] = React.useState<string>('');
  const [tagline, setTagline] = React.useState<string>('');
  const [bubblesCsv, setBubblesCsv] = React.useState<string>('');

  // Background image
  const [backgroundImage, setBackgroundImage] = React.useState<string | null>(null);
  const [backgroundImageAlt, setBackgroundImageAlt] = React.useState<string>('');
  const [backgroundOpacity, setBackgroundOpacity] = React.useState<number>(0.25);

  // Gradient controls
  const [degree, setDegree] = React.useState<number>(180);
  const [color1, setColor1] = React.useState<string>('#5038a0');
  const [color2, setColor2] = React.useState<string>('#121242');

  const [ariaLabel, setAriaLabel] = React.useState<string>('Impact report hero');

  // CTAs
  const [primaryLabel, setPrimaryLabel] = React.useState<string>('');
  const [primaryHref, setPrimaryHref] = React.useState<string>('');
  const [secondaryLabel, setSecondaryLabel] = React.useState<string>('');
  const [secondaryHref, setSecondaryHref] = React.useState<string>('');

  // Background video support removed

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
      // @ts-expect-error backgroundOpacity present on backend
      setBackgroundOpacity(typeof (hero as any).backgroundOpacity === 'number' ? (hero as any).backgroundOpacity : 0.25);
      const g = parseGradient(hero.backgroundColor as string | null);
      setDegree(g.degree);
      setColor1(g.color1);
      setColor2(g.color2);
      // overlay removed
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
      // backgroundVideo, textAlign, layoutVariant removed
      setBackgroundImageAlt((hero as any).backgroundImageAlt ?? '');
      setAriaLabel((hero as any).ariaLabel ?? 'Impact report hero');
      
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
    kind: 'bgImage',
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
        // video formats no longer supported for hero background
        return 'bin';
      };

      const ext = inferExt();
      const key = `media/hero/background.${ext}`;

      const { publicUrl } = await uploadFile(f, { key });
      setBackgroundImage(publicUrl);
      setStatus('Done');
    } catch (e) {
      setStatus('Failed');
    }
  };


  const onSaveHero = async () => {
    const backgroundColor = composeGradient(degree, color1, color2);
    const bubbles = bubblesCsv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const backgroundImagePayload = backgroundImage ?? null;

    const payload: Record<string, unknown> = {
      backgroundColor,
      backgroundImage: backgroundImagePayload,
      backgroundImageAlt: backgroundImage ? (backgroundImageAlt || null) : null,
      backgroundOpacity,
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
      ariaLabel,
    };

    const saved = await saveHeroContent(payload);
    setStatus(saved ? 'Hero saved' : 'Failed to save hero');
  };

  return (
    <div className="admin-dark" style={{ maxWidth: 900, margin: '40px auto', padding: 16 }}>
      <h1>Admin</h1>
      <p>Upload media and edit hero content.</p>

      

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
        <h2>Background Media</h2>
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
        <div style={{ marginTop: 12 }}>
          <label title="Opacity for the background image from 0.0 to 1.0.">
            Background Image Opacity
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={backgroundOpacity}
              onChange={(e) => setBackgroundOpacity(Number(e.target.value))}
              style={{ marginLeft: 8, verticalAlign: 'middle' }}
            />
            <span style={{ marginLeft: 8 }}>{backgroundOpacity.toFixed(2)}</span>
          </label>
        </div>
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
