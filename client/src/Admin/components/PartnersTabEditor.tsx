import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  FormControlLabel,
  Switch,
  Slider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ColorPickerPopover from '../../components/ColorPickerPopover';
import { CustomTextField } from '../styles';
import { GradientEditor, parseGradientString, composeGradient } from './GradientEditor';
import { PartnersContent, PartnerItem, PartnersCarousel, PartnersCTA, PartnersFallbackLink } from '../../services/impact.api';
import { v4 as uuidv4 } from 'uuid';
import COLORS from '../../../assets/colors';

export interface PartnersTabEditorProps {
  partners: PartnersContent;
  defaultSwatch: string[] | null;
  onPartnersChange: (field: keyof PartnersContent, value: any) => void;
}

type ColorPickerField =
  | 'glowColor1'
  | 'glowColor2'
  | 'glowColor3'
  | 'subtitleColor'
  | 'gridLabelColor'
  | 'badgeBgColor'
  | 'badgeHoverBgColor'
  | 'badgeBorderColor'
  | 'badgeHoverBorderColor'
  | 'badgeTitleColor'
  | 'badgeDescriptorColor'
  | 'betweenNoteColor'
  | 'carousel.itemBgColor'
  | 'carousel.itemTextColor'
  | 'carousel.itemBorderColor'
  | 'carousel.itemHoverBgColor'
  | 'carousel.itemHoverTextColor'
  | 'cta.viewAllBgColor'
  | 'cta.viewAllTextColor'
  | 'cta.viewAllBorderColor'
  | 'cta.viewAllHoverBgColor'
  | 'cta.donateTextColor';

export function PartnersTabEditor({
  partners,
  defaultSwatch,
  onPartnersChange,
}: PartnersTabEditorProps) {
  const [colorPickerAnchor, setColorPickerAnchor] = useState<HTMLElement | null>(null);
  const [colorPickerField, setColorPickerField] = useState<ColorPickerField | null>(null);

  // Drag state for partners
  const [draggedPartnerIndex, setDraggedPartnerIndex] = useState<number | null>(null);
  const [dragOverPartnerIndex, setDragOverPartnerIndex] = useState<number | null>(null);

  // State for gradient color picker
  const [gradientPickerAnchor, setGradientPickerAnchor] = useState<HTMLElement | null>(null);
  const [gradientPickerKey, setGradientPickerKey] = useState<'sectionBgGradient' | 'titleGradient' | 'cta.donateBgGradient' | 'cta.donateHoverBgGradient' | null>(null);
  const [gradientPickerColorIndex, setGradientPickerColorIndex] = useState<number>(0);
  const gradientPickerOpen = Boolean(gradientPickerAnchor);

  // Partner dot color picker
  const [dotColorAnchor, setDotColorAnchor] = useState<HTMLElement | null>(null);
  const [dotColorIndex, setDotColorIndex] = useState<number | null>(null);

  // Get gradient value
  const getGradientValue = (key: 'sectionBgGradient' | 'titleGradient' | 'cta.donateBgGradient' | 'cta.donateHoverBgGradient'): string => {
    if (key === 'sectionBgGradient') return partners.sectionBgGradient || '';
    if (key === 'titleGradient') return partners.titleGradient || '';
    if (key === 'cta.donateBgGradient') return partners.cta?.donateBgGradient || '';
    if (key === 'cta.donateHoverBgGradient') return partners.cta?.donateHoverBgGradient || '';
    return '';
  };

  // Get current gradient color for the picker
  const getGradientPickerColor = (): string => {
    if (!gradientPickerKey) return '#000000';
    const gradient = getGradientValue(gradientPickerKey);
    if (!gradient) return '#000000';
    const parsed = parseGradientString(gradient);
    return parsed.colors[gradientPickerColorIndex] || '#000000';
  };

  const openGradientPicker = (el: HTMLElement, key: 'sectionBgGradient' | 'titleGradient' | 'cta.donateBgGradient' | 'cta.donateHoverBgGradient', colorIndex: number) => {
    setGradientPickerKey(key);
    setGradientPickerColorIndex(colorIndex);
    setGradientPickerAnchor(el);
  };

  const handleGradientColorChange = (color: string) => {
    if (!gradientPickerKey) return;
    const currentGradient = getGradientValue(gradientPickerKey);
    if (!currentGradient) {
      const newGradient = `linear-gradient(135deg, ${color}, ${color})`;
      if (gradientPickerKey === 'sectionBgGradient') {
        onPartnersChange('sectionBgGradient', newGradient);
      } else if (gradientPickerKey === 'titleGradient') {
        onPartnersChange('titleGradient', newGradient);
      } else if (gradientPickerKey.startsWith('cta.')) {
        const subField = gradientPickerKey.replace('cta.', '');
        onPartnersChange('cta', { ...cta, [subField]: newGradient });
      }
      return;
    }
    const parsed = parseGradientString(currentGradient);
    const newColors = [...parsed.colors];
    newColors[gradientPickerColorIndex] = color;
    const newGradient = composeGradient(parsed.type, parsed.degree, newColors, parsed.opacity);
    if (gradientPickerKey === 'sectionBgGradient') {
      onPartnersChange('sectionBgGradient', newGradient);
    } else if (gradientPickerKey === 'titleGradient') {
      onPartnersChange('titleGradient', newGradient);
    } else if (gradientPickerKey.startsWith('cta.')) {
      const subField = gradientPickerKey.replace('cta.', '');
      onPartnersChange('cta', { ...cta, [subField]: newGradient });
    }
  };

  const closeGradientPicker = () => {
    setGradientPickerAnchor(null);
    setGradientPickerKey(null);
  };

  // Color picker helpers
  const openColorPicker = (el: HTMLElement, field: ColorPickerField) => {
    setColorPickerField(field);
    setColorPickerAnchor(el);
  };

  const handleColorChange = (color: string) => {
    if (!colorPickerField) return;

    if (colorPickerField.startsWith('carousel.')) {
      const subField = colorPickerField.replace('carousel.', '');
      onPartnersChange('carousel', { ...carousel, [subField]: color });
    } else if (colorPickerField.startsWith('cta.')) {
      const subField = colorPickerField.replace('cta.', '');
      onPartnersChange('cta', { ...cta, [subField]: color });
    } else {
      onPartnersChange(colorPickerField as keyof PartnersContent, color);
    }
  };

  const closeColorPicker = () => {
    setColorPickerAnchor(null);
    setColorPickerField(null);
  };

  const getColorValue = (field: ColorPickerField): string => {
    switch (field) {
      case 'glowColor1': return partners.glowColor1 || '';
      case 'glowColor2': return partners.glowColor2 || '';
      case 'glowColor3': return partners.glowColor3 || '';
      case 'subtitleColor': return partners.subtitleColor || '';
      case 'gridLabelColor': return partners.gridLabelColor || '';
      case 'badgeBgColor': return partners.badgeBgColor || '';
      case 'badgeHoverBgColor': return partners.badgeHoverBgColor || '';
      case 'badgeBorderColor': return partners.badgeBorderColor || '';
      case 'badgeHoverBorderColor': return partners.badgeHoverBorderColor || '';
      case 'badgeTitleColor': return partners.badgeTitleColor || '';
      case 'badgeDescriptorColor': return partners.badgeDescriptorColor || '';
      case 'betweenNoteColor': return partners.betweenNoteColor || '';
      case 'carousel.itemBgColor': return partners.carousel?.itemBgColor || '';
      case 'carousel.itemTextColor': return partners.carousel?.itemTextColor || '';
      case 'carousel.itemBorderColor': return partners.carousel?.itemBorderColor || '';
      case 'carousel.itemHoverBgColor': return partners.carousel?.itemHoverBgColor || '';
      case 'carousel.itemHoverTextColor': return partners.carousel?.itemHoverTextColor || '';
      case 'cta.viewAllBgColor': return partners.cta?.viewAllBgColor || '';
      case 'cta.viewAllTextColor': return partners.cta?.viewAllTextColor || '';
      case 'cta.viewAllBorderColor': return partners.cta?.viewAllBorderColor || '';
      case 'cta.viewAllHoverBgColor': return partners.cta?.viewAllHoverBgColor || '';
      case 'cta.donateTextColor': return partners.cta?.donateTextColor || '';
      default: return '';
    }
  };

  // Partners list
  const partnersList: PartnerItem[] = partners.partners ?? [];

  // Fallback link helpers
  const fallbackLink: PartnersFallbackLink = partners.fallbackLink ?? { enabled: true, url: 'https://guitarsoverguns.org/supporters/' };

  const updateFallbackLink = (field: keyof PartnersFallbackLink, value: any) => {
    onPartnersChange('fallbackLink', { ...fallbackLink, [field]: value });
  };

  // Carousel helpers
  const carousel: PartnersCarousel = partners.carousel ?? { enabled: true, showCustomItems: false, customItems: [], speed: 60 };

  const updateCarousel = (field: keyof PartnersCarousel, value: any) => {
    onPartnersChange('carousel', { ...carousel, [field]: value });
  };

  // CTA helpers
  const cta: PartnersCTA = partners.cta ?? {
    viewAllText: 'View all our supporters ↗',
    viewAllUrl: 'https://guitarsoverguns.org/supporters/',
    donateText: 'Donate',
    donateUrl: 'https://www.classy.org/give/352794/#!/donation/checkout',
  };

  const updateCta = (field: keyof PartnersCTA, value: any) => {
    onPartnersChange('cta', { ...cta, [field]: value });
  };

  // Partner CRUD
  const addPartner = () => {
    const newPartner: PartnerItem = {
      id: uuidv4(),
      name: 'New Partner',
      dotColor: COLORS.gogo_blue,
    };
    onPartnersChange('partners', [...partnersList, newPartner]);
  };

  const updatePartner = (index: number, field: keyof PartnerItem, value: any) => {
    const updated = [...partnersList];
    updated[index] = { ...updated[index], [field]: value };
    onPartnersChange('partners', updated);
  };

  const removePartner = (index: number) => {
    const updated = [...partnersList];
    updated.splice(index, 1);
    onPartnersChange('partners', updated);
  };

  // Custom carousel item CRUD
  const addCarouselItem = () => {
    const items = [...(carousel.customItems || []), 'New Item'];
    updateCarousel('customItems', items);
  };

  const updateCarouselItem = (index: number, value: string) => {
    const items = [...(carousel.customItems || [])];
    items[index] = value;
    updateCarousel('customItems', items);
  };

  const removeCarouselItem = (index: number) => {
    const items = [...(carousel.customItems || [])];
    items.splice(index, 1);
    updateCarousel('customItems', items);
  };

  // Partner drag handlers
  const handlePartnerDragStart = (index: number) => {
    setDraggedPartnerIndex(index);
  };
  const handlePartnerDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverPartnerIndex(index);
  };
  const handlePartnerDrop = (index: number) => {
    if (draggedPartnerIndex === null || draggedPartnerIndex === index) {
      setDraggedPartnerIndex(null);
      setDragOverPartnerIndex(null);
      return;
    }
    const updated = [...partnersList];
    const [removed] = updated.splice(draggedPartnerIndex, 1);
    updated.splice(index, 0, removed);
    onPartnersChange('partners', updated);
    setDraggedPartnerIndex(null);
    setDragOverPartnerIndex(null);
  };

  return (
    <Grid container spacing={3}>
      {/* Color Picker Popover */}
      <ColorPickerPopover
        open={Boolean(colorPickerAnchor) && Boolean(colorPickerField)}
        anchorEl={colorPickerAnchor}
        color={colorPickerField ? getColorValue(colorPickerField) : '#ffffff'}
        onChange={handleColorChange}
        onClose={closeColorPicker}
        swatches={defaultSwatch ?? undefined}
      />

      {/* Gradient Color Picker Popover */}
      <ColorPickerPopover
        open={gradientPickerOpen}
        anchorEl={gradientPickerAnchor}
        color={getGradientPickerColor()}
        onChange={handleGradientColorChange}
        onClose={closeGradientPicker}
        swatches={defaultSwatch ?? undefined}
      />

      {/* Dot Color Picker */}
      <ColorPickerPopover
        open={Boolean(dotColorAnchor)}
        anchorEl={dotColorAnchor}
        color={dotColorIndex !== null ? partnersList[dotColorIndex]?.dotColor || '' : ''}
        onChange={(color) => {
          if (dotColorIndex !== null) {
            updatePartner(dotColorIndex, 'dotColor', color);
          }
        }}
        onClose={() => {
          setDotColorAnchor(null);
          setDotColorIndex(null);
        }}
        swatches={defaultSwatch ?? undefined}
      />

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION SETTINGS */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
          Section Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Switch
                checked={partners.visible !== false}
                onChange={(e) => onPartnersChange('visible', e.target.checked)}
              />
            }
            label="Section visible"
          />
          <FormControlLabel
            control={
              <Switch
                checked={partners.animationsEnabled !== false}
                onChange={(e) => onPartnersChange('animationsEnabled', e.target.checked)}
              />
            }
            label="Animations enabled"
          />
        </Box>
      </Grid>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION BACKGROUND */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
          Section Background
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <GradientEditor
          label="Section Background Gradient"
          value={partners.sectionBgGradient || ''}
          onChange={(val) => onPartnersChange('sectionBgGradient', val)}
          onPickColor={(el, idx) => openGradientPicker(el, 'sectionBgGradient', idx)}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
          Ambient Glow Colors
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'glowColor1')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: partners.glowColor1 || 'rgba(79,70,229,0.25)', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Glow 1
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'glowColor2')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: partners.glowColor2 || 'rgba(16,185,129,0.15)', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Glow 2
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'glowColor3')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: partners.glowColor3 || 'rgba(56,189,248,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Glow 3
          </Button>
        </Box>
      </Grid>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* HEADER */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
          Header
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <CustomTextField
          fullWidth
          label="Title"
          value={partners.title ?? 'Our Supporters'}
          onChange={(e) => onPartnersChange('title', e.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        <GradientEditor
          label="Title Gradient"
          value={partners.titleGradient || ''}
          onChange={(val) => onPartnersChange('titleGradient', val)}
          onPickColor={(el, idx) => openGradientPicker(el, 'titleGradient', idx)}
        />
      </Grid>

      <Grid item xs={12}>
        <CustomTextField
          fullWidth
          label="Subtitle"
          multiline
          minRows={2}
          value={partners.subtitle ?? 'Thank you to every donor and partner—your generosity makes Guitars Over Guns possible.'}
          onChange={(e) => onPartnersChange('subtitle', e.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'subtitleColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: partners.subtitleColor || '#94a3b8', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Subtitle color
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12} md={8}>
        <CustomTextField
          fullWidth
          label="Grid Label"
          value={partners.gridLabel ?? 'Major Supporters ($25,000+)'}
          onChange={(e) => onPartnersChange('gridLabel', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: { xs: 0, md: 1 } }}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'gridLabelColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: partners.gridLabelColor || '#cbd5e1', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Label color
          </Button>
        </Box>
      </Grid>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* PARTNER CARD STYLING */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
          Partner Card Styling
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
          Card Colors
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'badgeBgColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: partners.badgeBgColor || 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Background
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'badgeHoverBgColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: partners.badgeHoverBgColor || 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Hover BG
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'badgeBorderColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: partners.badgeBorderColor || 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Border
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'badgeHoverBorderColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: partners.badgeHoverBorderColor || 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Hover border
          </Button>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
          Text Colors
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'badgeTitleColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: partners.badgeTitleColor || '#f1f5f9', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Title
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'badgeDescriptorColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: partners.badgeDescriptorColor || '#94a3b8', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Descriptor
          </Button>
        </Box>
      </Grid>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* FALLBACK LINK */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="h6" sx={{ mb: 1, color: 'rgba(255,255,255,0.9)' }}>
          Fallback Link
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.5)' }}>
          When a partner doesn't have an individual link, use this fallback URL.
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={fallbackLink.enabled}
              onChange={(e) => updateFallbackLink('enabled', e.target.checked)}
            />
          }
          label="Enable fallback link"
        />
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          fullWidth
          label="Fallback URL"
          value={fallbackLink.url}
          onChange={(e) => updateFallbackLink('url', e.target.value)}
          disabled={!fallbackLink.enabled}
        />
      </Grid>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* PARTNERS LIST */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Partners ({partnersList.length})
          </Typography>
          <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={addPartner}>
            Add Partner
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12}>
        {partnersList.map((partner, index) => (
          <Box
            key={partner.id}
            draggable
            onDragStart={() => handlePartnerDragStart(index)}
            onDragOver={(e) => handlePartnerDragOver(e, index)}
            onDrop={() => handlePartnerDrop(index)}
            onDragEnd={() => {
              setDraggedPartnerIndex(null);
              setDragOverPartnerIndex(null);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              mb: 1,
              borderRadius: 1,
              backgroundColor: dragOverPartnerIndex === index ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
              border: '1px solid',
              borderColor: dragOverPartnerIndex === index ? 'primary.main' : 'rgba(255,255,255,0.1)',
              '&:hover': { borderColor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <DragIndicatorIcon sx={{ cursor: 'grab', color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
            <Box
              onClick={(e) => {
                setDotColorIndex(index);
                setDotColorAnchor(e.currentTarget);
              }}
              sx={{
                minWidth: 28,
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: partner.dotColor || COLORS.gogo_blue,
                border: '2px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                flexShrink: 0,
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            />
            <CustomTextField
              size="small"
              label="Name"
              value={partner.name}
              onChange={(e) => updatePartner(index, 'name', e.target.value)}
              sx={{ flex: 2 }}
            />
            <CustomTextField
              size="small"
              label="Description (optional)"
              value={partner.descriptor ?? ''}
              onChange={(e) => updatePartner(index, 'descriptor', e.target.value || null)}
              sx={{ flex: 2 }}
            />
            <CustomTextField
              size="small"
              label="Link (optional)"
              value={partner.url ?? ''}
              onChange={(e) => updatePartner(index, 'url', e.target.value || null)}
              sx={{ flex: 2 }}
            />
            <IconButton color="error" size="small" onClick={() => removePartner(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Grid>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* BETWEEN NOTE */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
          Between Note
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <CustomTextField
          fullWidth
          multiline
          minRows={2}
          label="Note Text"
          value={partners.betweenNoteText ?? 'The supporters below represent additional donors who make our work possible...'}
          onChange={(e) => onPartnersChange('betweenNoteText', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'betweenNoteColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: partners.betweenNoteColor || '#94a3b8', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Note color
          </Button>
        </Box>
      </Grid>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* CAROUSEL */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="h6" sx={{ mb: 1, color: 'rgba(255,255,255,0.9)' }}>
          Carousel
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.5)' }}>
          Scrolling ticker below the partner grid.
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={carousel.enabled}
              onChange={(e) => updateCarousel('enabled', e.target.checked)}
            />
          }
          label="Show carousel"
        />
      </Grid>

      {carousel.enabled && (
        <>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={carousel.showCustomItems}
                  onChange={(e) => updateCarousel('showCustomItems', e.target.checked)}
                />
              }
              label="Use custom items instead of partner names"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
              Animation Speed: {carousel.speed}s
            </Typography>
            <Slider
              value={carousel.speed || 60}
              onChange={(_, val) => updateCarousel('speed', val as number)}
              min={10}
              max={200}
              step={5}
              marks={[
                { value: 10, label: '10s' },
                { value: 60, label: '60s' },
                { value: 120, label: '120s' },
                { value: 200, label: '200s' },
              ]}
              sx={{
                maxWidth: 400,
                '& .MuiSlider-markLabel': {
                  color: 'rgba(255,255,255,0.7)',
                },
              }}
            />
          </Grid>

          {carousel.showCustomItems && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Custom Carousel Items</Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={addCarouselItem}>
                  Add
                </Button>
              </Box>
              {(carousel.customItems || []).map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <CustomTextField
                    size="small"
                    value={item}
                    onChange={(e) => updateCarouselItem(idx, e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <IconButton color="error" size="small" onClick={() => removeCarouselItem(idx)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, color: 'rgba(255,255,255,0.7)' }}>
              Carousel Item Styling
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => openColorPicker(e.currentTarget, 'carousel.itemBgColor')}
                sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
              >
                <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: carousel.itemBgColor || 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.2)' }} />
                &nbsp;Background
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => openColorPicker(e.currentTarget, 'carousel.itemTextColor')}
                sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
              >
                <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: carousel.itemTextColor || '#cbd5e1', border: '1px solid rgba(255,255,255,0.2)' }} />
                &nbsp;Text
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => openColorPicker(e.currentTarget, 'carousel.itemBorderColor')}
                sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
              >
                <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: carousel.itemBorderColor || 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)' }} />
                &nbsp;Border
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => openColorPicker(e.currentTarget, 'carousel.itemHoverBgColor')}
                sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
              >
                <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: carousel.itemHoverBgColor || 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)' }} />
                &nbsp;Hover BG
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => openColorPicker(e.currentTarget, 'carousel.itemHoverTextColor')}
                sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
              >
                <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: carousel.itemHoverTextColor || '#fff', border: '1px solid rgba(255,255,255,0.2)' }} />
                &nbsp;Hover text
              </Button>
            </Box>
          </Grid>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* CTA BUTTONS */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
          CTA Buttons
        </Typography>
      </Grid>

      {/* View All Button */}
      <Grid item xs={12}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
          View All Button
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          fullWidth
          label="Button Text"
          value={cta.viewAllText}
          onChange={(e) => updateCta('viewAllText', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          fullWidth
          label="Button URL"
          value={cta.viewAllUrl}
          onChange={(e) => updateCta('viewAllUrl', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'cta.viewAllBgColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: cta.viewAllBgColor || 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Background
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'cta.viewAllTextColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: cta.viewAllTextColor || '#e2e8f0', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Text
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'cta.viewAllBorderColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: cta.viewAllBorderColor || 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Border
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'cta.viewAllHoverBgColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: cta.viewAllHoverBgColor || 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Hover BG
          </Button>
        </Box>
      </Grid>

      {/* Donate Button */}
      <Grid item xs={12}>
        <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, color: 'rgba(255,255,255,0.7)' }}>
          Donate Button
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          fullWidth
          label="Button Text"
          value={cta.donateText}
          onChange={(e) => updateCta('donateText', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          fullWidth
          label="Button URL"
          value={cta.donateUrl}
          onChange={(e) => updateCta('donateUrl', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <GradientEditor
          label="Button Gradient"
          value={cta.donateBgGradient || ''}
          onChange={(val) => updateCta('donateBgGradient', val)}
          onPickColor={(el, idx) => openGradientPicker(el, 'cta.donateBgGradient', idx)}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => openColorPicker(e.currentTarget, 'cta.donateTextColor')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: cta.donateTextColor || '#fff', border: '1px solid rgba(255,255,255,0.2)' }} />
            &nbsp;Text color
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default PartnersTabEditor;
