import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Box,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import { v4 as uuidv4 } from "uuid";
import ScreenGrid from "../components/ScreenGrid.tsx";
import COLORS from "../../assets/colors.ts";
import styled from "styled-components";
import HeroSection from "../components/HeroSection.tsx";
import { signUpload } from "../services/upload.api.ts";
import { saveMedia } from "../services/media.api.ts";
import { fetchHeroContent, saveHeroContent } from "../services/impact.api.ts";
import "../../assets/fonts/fonts.css";
import { useSnackbar } from "notistack";

const MemoHeroSection = React.memo(HeroSection);

function parseGradient(input: string | null | undefined): {
  degree: number;
  color1: string;
  color2: string;
} {
  const fallback = { degree: 180, color1: "#5038a0", color2: "#121242" };
  if (!input) return fallback;
  // Expect strings we compose like: linear-gradient(180deg, <c1> 0%, <c2> 100%)
  const m = input.match(
    /linear-gradient\(\s*(\d+)\s*deg\s*,\s*(.+?)\s+0%\s*,\s*(.+?)\s+100%\s*\)/i,
  );
  if (!m) return fallback;
  const degree = Math.max(1, Math.min(360, Number(m[1]) || 180));
  const color1 = m[2].trim();
  const color2 = m[3].trim();
  if (
    !color1 ||
    !color2 ||
    /undefined/i.test(color1) ||
    /undefined/i.test(color2)
  ) {
    return fallback;
  }
  return { degree, color1, color2 };
}

function withAlpha(color: string, alpha: number): string {
  const clamp = (v: number, min = 0, max = 1) =>
    Math.max(min, Math.min(max, v));
  const a = clamp(alpha);
  const hex = color.trim();
  if (hex.startsWith("#")) {
    const raw = hex.slice(1);
    const expand = (s: string) =>
      s.length === 3
        ? s
            .split("")
            .map((c) => c + c)
            .join("")
        : s;
    const full = expand(raw);
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  if (hex.startsWith("rgb(")) {
    const nums = hex
      .replace(/rgb\(/i, "")
      .replace(/\)/, "")
      .split(",")
      .map((s) => s.trim());
    const [r, g, b] = nums;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  if (hex.startsWith("rgba(")) {
    const nums = hex
      .replace(/rgba\(/i, "")
      .replace(/\)/, "")
      .split(",")
      .map((s) => s.trim());
    const [r, g, b] = nums;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return color; // fallback – leave as-is
}

function composeGradient(
  degree: number,
  color1: string,
  color2: string,
  alpha: number,
): string {
  const c1 = withAlpha(color1, alpha);
  const c2 = withAlpha(color2, alpha);
  return `linear-gradient(${degree}deg, ${c1} 0%, ${c2} 100%)`;
}

function isValidColorStop(color: string | null | undefined): boolean {
  if (!color) return false;
  if (/undefined/i.test(color)) return false;
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  const rgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
  const rgba =
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/i;
  return hex.test(color) || rgb.test(color) || rgba.test(color);
}

// Styled components for dark theme
const CustomPaper = styled(Paper)`
  && {
    background-color: #151821; /* increase specificity to beat MuiPaper background */
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
    font-family: "Century Gothic", "Arial", sans-serif;
  }
`;

const CustomTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    color: white;
    & fieldset {
      border-color: rgba(255, 255, 255, 0.3);
    }
    &:hover fieldset {
      border-color: rgba(255, 255, 255, 0.5);
    }
    &.Mui-focused fieldset {
      border-color: ${COLORS.gogo_blue};
    }
  }
  & .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
    &.Mui-focused {
      color: ${COLORS.gogo_blue};
    }
  }
`;

// Force preview hero to be shorter (20% less height than default 85vh)
const PreviewFrame = styled.div`
  & section {
    min-height: 68vh !important; /* 80% of 85vh */
  }
`;

// Simple circular degree picker
function DegreePicker({
  value,
  onChange,
  size = 120,
}: {
  value: number;
  onChange: (deg: number) => void;
  size?: number;
}) {
  const [dragging, setDragging] = useState(false);

  const handlePointer = (clientX: number, clientY: number, rect: DOMRect) => {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = clientX - cx;
    const y = clientY - cy;
    // Photoshop-like: 0deg at top, clockwise
    const rad = Math.atan2(y, x);
    let deg = Math.round(((rad * 180) / Math.PI + 90 + 360) % 360);
    deg = Math.max(1, Math.min(360, deg));
    onChange(deg);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setDragging(true);
    handlePointer(e.clientX, e.clientY, rect);
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    handlePointer(e.clientX, e.clientY, rect);
  };
  const onMouseUp = () => setDragging(false);
  const onMouseLeave = () => setDragging(false);

  const radius = size / 2;
  const angleRad = ((value - 90) * Math.PI) / 180;
  const indicatorX = radius + (radius - 10) * Math.cos(angleRad);
  const indicatorY = radius + (radius - 10) * Math.sin(angleRad);

  return (
    <div
      role="slider"
      aria-valuenow={value}
      aria-label="Gradient angle"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{
        width: size,
        height: size,
        position: "relative",
        cursor: "pointer",
      }}
    >
      <svg width={size} height={size} style={{ display: "block" }}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - 1}
          fill="#0f1118"
          stroke="rgba(255,255,255,0.2)"
        />
        {/* Crosshairs */}
        <line
          x1={radius}
          y1={8}
          x2={radius}
          y2={size - 8}
          stroke="rgba(255,255,255,0.1)"
        />
        <line
          x1={8}
          y1={radius}
          x2={size - 8}
          y2={radius}
          stroke="rgba(255,255,255,0.1)"
        />
        {/* Indicator */}
        <line
          x1={radius}
          y1={radius}
          x2={indicatorX}
          y2={indicatorY}
          stroke={COLORS.gogo_blue}
          strokeWidth={2}
        />
        <circle cx={indicatorX} cy={indicatorY} r={6} fill={COLORS.gogo_blue} />
      </svg>
    </div>
  );
}

// Impact Report Section Types
interface HeroSection {
  title: string;
  subtitle: string;
  year: string;
  tagline: string;
  bubblesCsv: string;
  degree: number;
  color1: string;
  color2: string;
  gradientOpacity: number;
  backgroundImageUrl: string | null;
  backgroundImagePreview: string | null;
  backgroundImageAlt: string;
  backgroundOpacity: number;
  ariaLabel: string;
  // CTA editing fields
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  enabled: boolean;
}

interface MissionSection {
  title: string;
  content: string;
  image: File | null;
  imagePreview: string | null;
  enabled: boolean;
}

interface ImpactSection {
  title: string;
  stats: Array<{
    id: string;
    number: string;
    label: string;
  }>;
  enabled: boolean;
}

interface ProgramsSection {
  title: string;
  programs: Array<{
    id: string;
    name: string;
    description: string;
    image: File | null;
    imagePreview: string | null;
  }>;
  enabled: boolean;
}

interface LocationsSection {
  title: string;
  locations: Array<{
    id: string;
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  }>;
  enabled: boolean;
}

interface TestimonialSection {
  title: string;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    image: File | null;
    imagePreview: string | null;
  }>;
  enabled: boolean;
}

interface ImpactReportForm {
  hero: HeroSection;
  mission: MissionSection;
  impact: ImpactSection;
  programs: ProgramsSection;
  locations: LocationsSection;
  testimonials: TestimonialSection;
}

/**
 * A page for customizing the entire impact report
 */
function ImpactReportCustomizationPage() {
  const { enqueueSnackbar } = useSnackbar();
  // Current tab state
  const [currentTab, setCurrentTab] = useState(0);

  // Impact report form state with default values
  const [impactReportForm, setImpactReportForm] = useState<ImpactReportForm>({
    hero: {
      title: "",
      subtitle: "",
      year: "",
      tagline: "",
      bubblesCsv: "",
      degree: 180,
      color1: "#000000",
      color2: "#000000",
      gradientOpacity: 0,
      backgroundImageUrl: null,
      backgroundImagePreview: null,
      backgroundImageAlt: "",
      backgroundOpacity: 0,
      ariaLabel: "",
      primaryCtaLabel: "Watch Our Story",
      primaryCtaHref: "https://youtu.be/21ufVKC5TEo?si=3N7xugwbc3Z4RNm-",
      secondaryCtaLabel: "Support Our Mission",
      secondaryCtaHref:
        "https://www.classy.org/give/352794/#!/donation/checkout",
      enabled: true,
    },
    mission: {
      title: "Our Mission",
      content:
        "Guitars Over Guns is a 501(c)(3) organization that connects youth with professional musician mentors to help them overcome hardship, find their voice and reach their potential through music, art and mentorship.",
      image: null,
      imagePreview: null,
      enabled: true,
    },
    impact: {
      title: "Our Impact",
      stats: [
        { id: "1", number: "500+", label: "Students Served" },
        { id: "2", number: "15", label: "Years of Service" },
        { id: "3", number: "95%", label: "Graduation Rate" },
        { id: "4", number: "4", label: "Cities" },
      ],
      enabled: true,
    },
    programs: {
      title: "Our Programs",
      programs: [
        {
          id: "1",
          name: "Music Mentorship",
          description: "One-on-one mentorship with professional musicians",
          image: null,
          imagePreview: null,
        },
        {
          id: "2",
          name: "Group Sessions",
          description: "Collaborative learning in small groups",
          image: null,
          imagePreview: null,
        },
      ],
      enabled: true,
    },
    locations: {
      title: "Our Locations",
      locations: [
        {
          id: "1",
          name: "Miami",
          address: "Miami, FL",
          coordinates: { lat: 25.7617, lng: -80.1918 },
        },
        {
          id: "2",
          name: "Chicago",
          address: "Chicago, IL",
          coordinates: { lat: 41.8781, lng: -87.6298 },
        },
      ],
      enabled: true,
    },
    testimonials: {
      title: "What Our Students Say",
      testimonials: [
        {
          id: "1",
          name: "Maria Rodriguez",
          role: "Student, Miami",
          content:
            "Guitars Over Guns changed my life. I found my voice through music.",
          image: null,
          imagePreview: null,
        },
      ],
      enabled: true,
    },
  });

  // Error states
  const [errors, setErrors] = useState<{
    general: string;
    heroAlt?: string;
  }>({
    general: "",
    heroAlt: undefined,
  });

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [heroUploadPct, setHeroUploadPct] = useState<number | null>(null);
  const [flashPreviewHero, setFlashPreviewHero] = useState(false);
  const [lastDeletedStat, setLastDeletedStat] = useState<{
    index: number;
    item: { id: string; number: string; label: string };
  } | null>(null);
  const [lastDeletedProgram, setLastDeletedProgram] = useState<{
    index: number;
    item: {
      id: string;
      name: string;
      description: string;
      image: File | null;
      imagePreview: string | null;
    };
  } | null>(null);
  const [lastDeletedTestimonial, setLastDeletedTestimonial] = useState<{
    index: number;
    item: {
      id: string;
      name: string;
      role: string;
      content: string;
      image: File | null;
      imagePreview: string | null;
    };
  } | null>(null);
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  // Refs for file inputs
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Generic image upload handler (currently used for mission image)
  const handleImageUpload = (
    section: string,
    field: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      if (section === "mission" && field === "image") {
        setImpactReportForm((prev) => ({
          ...prev,
          mission: {
            ...prev.mission,
            image: file,
            imagePreview: (readerEvent.target?.result as string) || null,
          },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle section changes
  const handleSectionChange = (
    section: keyof ImpactReportForm,
    field: string,
    value: any,
  ) => {
    setImpactReportForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setIsDirty(true);
    if (section === "hero") {
      setFlashPreviewHero(true);
      window.setTimeout(() => setFlashPreviewHero(false), 800);
    }
  };

  // Handle hero background image upload (upload to storage then set URL + preview)
  const handleHeroBackgroundUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    // Validate file type: allow common web-friendly formats only
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const isHeicLike =
      /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
    if (!allowedTypes.includes(file.type)) {
      const message = isHeicLike
        ? "HEIC images are not widely supported in browsers. Please upload a JPG or PNG instead."
        : "Unsupported image format. Please upload a JPG, PNG, or WebP image.";
      setErrors((prev) => ({ ...prev, general: message }));
      enqueueSnackbar(message, { variant: "warning" });
      return;
    }
    try {
      console.log("[admin][hero] background upload selected", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const key = `hero/background.${ext}`;
      const signed = await signUpload({
        contentType: file.type,
        extension: ext,
        key,
      });
      console.log(
        "[admin][hero] signed public URL",
        signed.publicUrl,
        "key",
        signed.key,
      );
      setHeroUploadPct(0);
      enqueueSnackbar("Uploading background…", { variant: "info" });

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signed.uploadUrl);
        if (file.type) xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const pct = Math.round((evt.loaded / evt.total) * 100);
            setHeroUploadPct(pct);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed: ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });

      // Save media record for reuse/library
      try {
        const mediaSave = await saveMedia({
          key: signed.key,
          publicUrl: signed.publicUrl,
          contentType: file.type,
          bytes: (file as File).size,
          alt: impactReportForm.hero.backgroundImageAlt || undefined,
          tag: "hero-background",
        });
        console.log("[admin][hero] media saved", {
          id: mediaSave.id,
          url: signed.publicUrl,
        });
      } catch (metaErr) {
        console.warn(
          "[admin][hero] media record save failed (non-fatal)",
          metaErr,
        );
      }

      enqueueSnackbar("Background uploaded", { variant: "success" });
      const preview = URL.createObjectURL(file);
      setImpactReportForm((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          backgroundImageUrl: signed.publicUrl,
          backgroundImagePreview: preview,
        },
      }));
      console.log(
        "[admin][hero] hero.backgroundImageUrl set",
        signed.publicUrl,
      );
      setErrors((prev) => ({ ...prev, general: "" }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[admin][hero] Failed to upload background image", err);
      enqueueSnackbar("Failed to upload background image", {
        variant: "error",
      });
      setErrors((prev) => ({
        ...prev,
        general: "Failed to upload background image. Please try again.",
      }));
    } finally {
      setHeroUploadPct(null);
    }
  };

  // Video/overlay support removed

  // Handle stat changes
  const handleStatChange = (
    statIndex: number,
    field: string,
    value: string,
  ) => {
    const updatedStats = [...impactReportForm.impact.stats];
    updatedStats[statIndex] = {
      ...updatedStats[statIndex],
      [field]: value,
    };
    handleSectionChange("impact", "stats", updatedStats);
  };

  // Add stat
  const handleAddStat = () => {
    const newStat = {
      id: uuidv4(),
      number: "",
      label: "",
    };
    handleSectionChange("impact", "stats", [
      ...impactReportForm.impact.stats,
      newStat,
    ]);
  };

  // Remove stat
  const handleRemoveStat = (index: number) => {
    const removed = impactReportForm.impact.stats[index];
    const updatedStats = impactReportForm.impact.stats.filter(
      (_, i) => i !== index,
    );
    handleSectionChange("impact", "stats", updatedStats);
    setLastDeletedStat({ index, item: removed });
    enqueueSnackbar("Statistic deleted", {
      variant: "info",
      action: (
        <Button
          color="inherit"
          size="small"
          onClick={() => {
            setImpactReportForm((prev) => {
              const stats = [...prev.impact.stats];
              stats.splice(index, 0, removed);
              return { ...prev, impact: { ...prev.impact, stats } };
            });
            setLastDeletedStat(null);
          }}
        >
          Undo
        </Button>
      ),
    });
  };

  // Handle program changes
  const handleProgramChange = (
    programIndex: number,
    field: string,
    value: any,
  ) => {
    const updatedPrograms = [...impactReportForm.programs.programs];
    updatedPrograms[programIndex] = {
      ...updatedPrograms[programIndex],
      [field]: value,
    };
    handleSectionChange("programs", "programs", updatedPrograms);
  };

  // Add program
  const handleAddProgram = () => {
    const newProgram = {
      id: uuidv4(),
      name: "",
      description: "",
      image: null,
      imagePreview: null,
    };
    handleSectionChange("programs", "programs", [
      ...impactReportForm.programs.programs,
      newProgram,
    ]);
  };

  // Remove program
  const handleRemoveProgram = (index: number) => {
    const removed = impactReportForm.programs.programs[index];
    const updatedPrograms = impactReportForm.programs.programs.filter(
      (_, i) => i !== index,
    );
    handleSectionChange("programs", "programs", updatedPrograms);
    setLastDeletedProgram({ index, item: removed });
    enqueueSnackbar("Program deleted", {
      variant: "info",
      action: (
        <Button
          color="inherit"
          size="small"
          onClick={() => {
            setImpactReportForm((prev) => {
              const programs = [...prev.programs.programs];
              programs.splice(index, 0, removed);
              return { ...prev, programs: { ...prev.programs, programs } };
            });
            setLastDeletedProgram(null);
          }}
        >
          Undo
        </Button>
      ),
    });
  };

  // Handle testimonial changes
  const handleTestimonialChange = (
    testimonialIndex: number,
    field: string,
    value: any,
  ) => {
    const updatedTestimonials = [...impactReportForm.testimonials.testimonials];
    updatedTestimonials[testimonialIndex] = {
      ...updatedTestimonials[testimonialIndex],
      [field]: value,
    };
    handleSectionChange("testimonials", "testimonials", updatedTestimonials);
  };

  // Add testimonial
  const handleAddTestimonial = () => {
    const newTestimonial = {
      id: uuidv4(),
      name: "",
      role: "",
      content: "",
      image: null,
      imagePreview: null,
    };
    handleSectionChange("testimonials", "testimonials", [
      ...impactReportForm.testimonials.testimonials,
      newTestimonial,
    ]);
  };

  // Remove testimonial
  const handleRemoveTestimonial = (index: number) => {
    const removed = impactReportForm.testimonials.testimonials[index];
    const updatedTestimonials =
      impactReportForm.testimonials.testimonials.filter((_, i) => i !== index);
    handleSectionChange("testimonials", "testimonials", updatedTestimonials);
    setLastDeletedTestimonial({ index, item: removed });
    enqueueSnackbar("Testimonial deleted", {
      variant: "info",
      action: (
        <Button
          color="inherit"
          size="small"
          onClick={() => {
            setImpactReportForm((prev) => {
              const testimonials = [...prev.testimonials.testimonials];
              testimonials.splice(index, 0, removed);
              return {
                ...prev,
                testimonials: { ...prev.testimonials, testimonials },
              };
            });
            setLastDeletedTestimonial(null);
          }}
        >
          Undo
        </Button>
      ),
    });
  };

  // Prefill from backend
  useEffect(() => {
    (async () => {
      const hero = await fetchHeroContent();
      if (!hero) return;
      const g = parseGradient(hero.backgroundColor as string | null);
      const alphaMatch = (hero.backgroundColor as string | "").match(
        /rgba\([^,]+,[^,]+,[^,]+,\s*(\d*\.?\d+)\)/i,
      );
      const parsedAlpha = alphaMatch
        ? Math.max(0, Math.min(1, parseFloat(alphaMatch[1] || "1")))
        : undefined;
      setImpactReportForm((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          title: hero.title ?? prev.hero.title,
          subtitle: hero.subtitle ?? prev.hero.subtitle,
          year: hero.year ?? prev.hero.year,
          tagline: hero.tagline ?? prev.hero.tagline,
          bubblesCsv: Array.isArray(hero.bubbles)
            ? hero.bubbles.join(", ")
            : prev.hero.bubblesCsv,
          degree: g.degree,
          color1: g.color1,
          color2: g.color2,
          gradientOpacity:
            typeof parsedAlpha === "number"
              ? parsedAlpha
              : prev.hero.gradientOpacity,
          backgroundImageUrl: hero.backgroundImage ?? null,
          backgroundImagePreview: null,
          backgroundOpacity:
            typeof (hero as any).backgroundOpacity === "number"
              ? (hero as any).backgroundOpacity
              : prev.hero.backgroundOpacity,
          primaryCtaLabel: hero.primaryCta?.label ?? prev.hero.primaryCtaLabel,
          primaryCtaHref: hero.primaryCta?.href ?? prev.hero.primaryCtaHref,
          secondaryCtaLabel:
            hero.secondaryCta?.label ?? prev.hero.secondaryCtaLabel,
          secondaryCtaHref:
            hero.secondaryCta?.href ?? prev.hero.secondaryCtaHref,
        },
      }));
    })();
  }, []);

  // Handle form submission
  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      // Validate hero alt if background image present
      if (
        impactReportForm.hero.backgroundImageUrl &&
        !impactReportForm.hero.backgroundImageAlt.trim()
      ) {
        setErrors((prev) => ({
          ...prev,
          heroAlt: "Alt text is required when a background image is set.",
        }));
        enqueueSnackbar("Please add alt text for the background image", {
          variant: "warning",
        });
        return;
      } else {
        setErrors((prev) => ({ ...prev, heroAlt: undefined }));
      }
      // Save Hero content to backend
      const bubbles = impactReportForm.hero.bubblesCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const safeDegree = Math.max(
        1,
        Math.min(360, Number(impactReportForm.hero.degree) || 180),
      );
      const safeColor1 = isValidColorStop(impactReportForm.hero.color1)
        ? impactReportForm.hero.color1
        : "#5038a0";
      const safeColor2 = isValidColorStop(impactReportForm.hero.color2)
        ? impactReportForm.hero.color2
        : "#121242";
      const safeAlpha = Math.max(
        0,
        Math.min(1, Number(impactReportForm.hero.gradientOpacity) || 0),
      );
      const backgroundColor = composeGradient(
        safeDegree,
        safeColor1,
        safeColor2,
        safeAlpha,
      );

      const backgroundImagePayload =
        impactReportForm.hero.backgroundImageUrl ?? null;

      const payload = {
        backgroundColor,
        backgroundImage: backgroundImagePayload,
        backgroundImageAlt: impactReportForm.hero.backgroundImageUrl
          ? impactReportForm.hero.backgroundImageAlt || null
          : null,
        // image is always full opacity; do not send backgroundOpacity
        title: impactReportForm.hero.title,
        subtitle: impactReportForm.hero.subtitle,
        year: impactReportForm.hero.year,
        tagline: impactReportForm.hero.tagline,
        bubbles,
        ariaLabel: impactReportForm.hero.ariaLabel,
        primaryCta: {
          label: impactReportForm.hero.primaryCtaLabel || undefined,
          href: impactReportForm.hero.primaryCtaHref || undefined,
        },
        secondaryCta: {
          label: impactReportForm.hero.secondaryCtaLabel || undefined,
          href: impactReportForm.hero.secondaryCtaHref || undefined,
        },
      };
      console.log("[admin][hero] save payload", payload);
      await saveHeroContent(payload);
      enqueueSnackbar("Impact report saved", { variant: "success" });
      setIsDirty(false);
      setLastSavedAt(new Date());
    } catch (error) {
      console.error("Error saving impact report:", error);
      setErrors((prev) => ({
        ...prev,
        general: "An error occurred while saving. Please try again.",
      }));
      enqueueSnackbar("Failed to save impact report", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // No preview toggle; preview is always visible on the left

  // Tab configuration
  const tabs = [
    { label: "Hero Section", value: 0 },
    { label: "Mission", value: 1 },
    { label: "Impact Stats", value: 2 },
    { label: "Programs", value: 3 },
    { label: "Locations", value: 4 },
    { label: "Testimonials", value: 5 },
  ];

  return (
    <ScreenGrid>
      <Grid
        item
        container
        spacing={{ xs: 2, md: 3 }}
        sx={{ width: "100%", px: { xs: 1, sm: 2, md: 3 } }}
      >
        {/* Left column: title + permanent preview */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{ position: { md: "sticky" as const }, top: { md: 24 }, mb: 2 }}
          >
            <Typography
              variant="h2"
              color="white"
              sx={{
                mb: 1,
                textAlign: { xs: "center", md: "left" },
                fontFamily: "'Airwaves', 'Century Gothic', 'Arial', sans-serif",
              }}
            >
              Customize Impact Report
            </Typography>
            <Typography
              variant="subtitle1"
              color="white"
              sx={{
                mb: 2,
                textAlign: { xs: "center", md: "left" },
                maxWidth: 600,
              }}
            >
              Customize all sections of the impact report to match your
              organization's needs
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isMobilePreview}
                    onChange={(e) => setIsMobilePreview(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: COLORS.gogo_blue,
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        { backgroundColor: COLORS.gogo_blue },
                    }}
                  />
                }
                label="Mobile view"
                sx={{ color: "white" }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CustomPaper
                sx={{
                  p: 0,
                  overflow: "hidden",
                  width: isMobilePreview ? { xs: "100%", md: 380 } : "100%",
                  maxWidth: isMobilePreview ? 440 : "none",
                }}
              >
                <PreviewFrame>
                  <Box
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: flashPreviewHero
                        ? `0 0 0 3px ${COLORS.gogo_blue}`
                        : "none",
                      transition: "box-shadow 0.3s ease",
                    }}
                  >
                    <HeroSection
                      disableFetch
                      heroOverride={{
                        title: impactReportForm.hero.title,
                        subtitle: impactReportForm.hero.subtitle,
                        year: impactReportForm.hero.year,
                        tagline: impactReportForm.hero.tagline,
                        primaryCta: {
                          label: impactReportForm.hero.primaryCtaLabel,
                          href: impactReportForm.hero.primaryCtaHref,
                        },
                        secondaryCta: {
                          label: impactReportForm.hero.secondaryCtaLabel,
                          href: impactReportForm.hero.secondaryCtaHref,
                        },
                        bubbles: impactReportForm.hero.bubblesCsv
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                        backgroundColor: composeGradient(
                          impactReportForm.hero.degree,
                          impactReportForm.hero.color1,
                          impactReportForm.hero.color2,
                          impactReportForm.hero.gradientOpacity,
                        ),
                        backgroundImage:
                          impactReportForm.hero.backgroundImageUrl ?? null,
                      }}
                    />
                  </Box>
                </PreviewFrame>
              </CustomPaper>
            </Box>
          </Box>
        </Grid>

        {/* Right column: actions + tabs + forms */}
        <Grid item xs={12} md={4}>
          {/* Action buttons */}
          <CustomPaper sx={{ p: { xs: 2, sm: 2 }, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "space-between" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Tooltip
                  title={
                    heroUploadPct !== null
                      ? "Please wait for the upload to finish"
                      : ""
                  }
                  disableHoverListener={heroUploadPct === null}
                >
                  <span>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={isSubmitting || heroUploadPct !== null}
                      sx={{
                        bgcolor: COLORS.gogo_blue,
                        "&:hover": { bgcolor: "#0066cc" },
                        minWidth: { xs: "100%", sm: "auto" },
                      }}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Box>
          </CustomPaper>
          {/* Save status */}
          <Box sx={{ mb: 2, textAlign: "center" }}>
            {isDirty ? (
              <Typography variant="body2" color="warning.main">
                Unsaved changes
              </Typography>
            ) : (
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                {lastSavedAt
                  ? `All changes saved · ${lastSavedAt.toLocaleTimeString()}`
                  : "No recent changes"}
              </Typography>
            )}
          </Box>

          {/* Tabs */}
          <CustomPaper sx={{ p: 0, overflow: "hidden", mb: 2 }}>
            <Tabs
              value={currentTab}
              onChange={(_, newValue) => setCurrentTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                "& .MuiTab-root": {
                  color: "rgba(255,255,255,0.7)",
                  minWidth: { xs: "auto", sm: 120 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  "&.Mui-selected": {
                    color: COLORS.gogo_blue,
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: COLORS.gogo_blue,
                },
              }}
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
          </CustomPaper>

          {/* Tab content */}
          <CustomPaper
            sx={{
              p: { xs: 2, sm: 3 },
              minHeight: { xs: 400, md: 600 },
              overflow: "auto",
            }}
          >
            {/* Hero Section */}
            {currentTab === 0 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily:
                        "'Airwaves', 'Century Gothic', 'Arial', sans-serif",
                    }}
                  >
                    Hero Section
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={impactReportForm.hero.enabled}
                        onChange={(e) =>
                          handleSectionChange(
                            "hero",
                            "enabled",
                            e.target.checked,
                          )
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: COLORS.gogo_blue,
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: COLORS.gogo_blue,
                            },
                        }}
                      />
                    }
                    label="Enable Section"
                    sx={{ color: "white" }}
                  />
                </Box>
                <Divider sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />

                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {/* Basics */}
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Hero Title"
                      value={impactReportForm.hero.title}
                      onChange={(e) =>
                        handleSectionChange("hero", "title", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Hero Subtitle"
                      value={impactReportForm.hero.subtitle}
                      onChange={(e) =>
                        handleSectionChange("hero", "subtitle", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <CustomTextField
                      label="Year"
                      value={impactReportForm.hero.year}
                      onChange={(e) =>
                        handleSectionChange("hero", "year", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <CustomTextField
                      label="Tagline"
                      value={impactReportForm.hero.tagline}
                      onChange={(e) =>
                        handleSectionChange("hero", "tagline", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <CustomTextField
                      label="Bubbles (comma separated)"
                      value={impactReportForm.hero.bubblesCsv}
                      onChange={(e) =>
                        handleSectionChange(
                          "hero",
                          "bubblesCsv",
                          e.target.value,
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  {/* CTAs */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Call To Action Buttons
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Primary CTA Label"
                      value={impactReportForm.hero.primaryCtaLabel}
                      onChange={(e) =>
                        handleSectionChange(
                          "hero",
                          "primaryCtaLabel",
                          e.target.value,
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Primary CTA Link (URL)"
                      value={impactReportForm.hero.primaryCtaHref}
                      onChange={(e) =>
                        handleSectionChange(
                          "hero",
                          "primaryCtaHref",
                          e.target.value,
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Secondary CTA Label"
                      value={impactReportForm.hero.secondaryCtaLabel}
                      onChange={(e) =>
                        handleSectionChange(
                          "hero",
                          "secondaryCtaLabel",
                          e.target.value,
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Secondary CTA Link (URL)"
                      value={impactReportForm.hero.secondaryCtaHref}
                      onChange={(e) =>
                        handleSectionChange(
                          "hero",
                          "secondaryCtaHref",
                          e.target.value,
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  {/* Gradient */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Background Gradient
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="caption"
                          color="rgba(255,255,255,0.7)"
                        >
                          Degree
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <DegreePicker
                            value={impactReportForm.hero.degree}
                            onChange={(deg) =>
                              handleSectionChange(
                                "hero",
                                "degree",
                                Math.max(1, Math.min(360, deg || 180)),
                              )
                            }
                            size={140}
                          />
                          <Typography variant="body2" sx={{ minWidth: 40 }}>
                            {impactReportForm.hero.degree}°
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{ ml: { md: 2 }, mr: { md: -1 } }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="rgba(255,255,255,0.7)"
                            >
                              Color 1
                            </Typography>
                            <input
                              type="color"
                              value={impactReportForm.hero.color1}
                              onChange={(e) =>
                                handleSectionChange(
                                  "hero",
                                  "color1",
                                  e.target.value,
                                )
                              }
                              style={{
                                width: 48,
                                height: 32,
                                padding: 0,
                                border: "none",
                                background: "transparent",
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="rgba(255,255,255,0.7)"
                            >
                              Color 2
                            </Typography>
                            <input
                              type="color"
                              value={impactReportForm.hero.color2}
                              onChange={(e) =>
                                handleSectionChange(
                                  "hero",
                                  "color2",
                                  e.target.value,
                                )
                              }
                              style={{
                                width: 48,
                                height: 32,
                                padding: 0,
                                border: "none",
                                background: "transparent",
                              }}
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ ml: { md: -1 } }}>
                        <Box
                          sx={{
                            width: 140,
                            height: 140,
                            borderRadius: 1,
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: composeGradient(
                              impactReportForm.hero.degree,
                              impactReportForm.hero.color1,
                              impactReportForm.hero.color2,
                              impactReportForm.hero.gradientOpacity,
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography
                        variant="caption"
                        color="rgba(255,255,255,0.7)"
                      >
                        Gradient Opacity
                      </Typography>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={impactReportForm.hero.gradientOpacity}
                        onChange={(e) =>
                          handleSectionChange(
                            "hero",
                            "gradientOpacity",
                            Number(e.target.value),
                          )
                        }
                      />
                      <Typography variant="body2">
                        {impactReportForm.hero.gradientOpacity.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Background Image */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Background Image
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleHeroBackgroundUpload}
                        style={{ display: "none" }}
                        ref={(el) => (fileInputRefs.current["hero-bg"] = el)}
                      />
                      <Button
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        onClick={() =>
                          fileInputRefs.current["hero-bg"]?.click()
                        }
                        sx={{ minWidth: { xs: "100%", sm: "auto" } }}
                      >
                        Upload Background
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        startIcon={<ClearIcon />}
                        onClick={() => {
                          setImpactReportForm((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              backgroundImageUrl: null,
                              backgroundImagePreview: null,
                            },
                          }));
                          setIsDirty(true);
                          enqueueSnackbar("Background cleared", {
                            variant: "info",
                          });
                        }}
                        disabled={
                          !impactReportForm.hero.backgroundImageUrl &&
                          !impactReportForm.hero.backgroundImagePreview
                        }
                      >
                        Clear Background
                      </Button>
                      {heroUploadPct !== null && (
                        <Box sx={{ flex: 1, minWidth: 180 }}>
                          <LinearProgress
                            variant="determinate"
                            value={heroUploadPct}
                          />
                          <Typography
                            variant="caption"
                            color="rgba(255,255,255,0.7)"
                          >
                            {heroUploadPct}%
                          </Typography>
                        </Box>
                      )}
                      {heroUploadPct === null &&
                        impactReportForm.hero.backgroundImagePreview && (
                          <Box
                            sx={{
                              width: { xs: "100%", sm: 120 },
                              height: { xs: 140, sm: 70 },
                              overflow: "hidden",
                              borderRadius: 1,
                              minWidth: { xs: "auto", sm: 120 },
                            }}
                          >
                            <img
                              src={impactReportForm.hero.backgroundImagePreview}
                              alt="Background preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Background Image Alt"
                      value={impactReportForm.hero.backgroundImageAlt}
                      onChange={(e) =>
                        handleSectionChange(
                          "hero",
                          "backgroundImageAlt",
                          e.target.value,
                        )
                      }
                      error={Boolean(errors.heroAlt)}
                      helperText={errors.heroAlt}
                      fullWidth
                    />
                  </Grid>
                  {/* Background image is always 100% opacity; slider removed */}

                  {/* Accessibility */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Accessibility
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="ARIA Label"
                      value={impactReportForm.hero.ariaLabel}
                      onChange={(e) =>
                        handleSectionChange("hero", "ariaLabel", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>

                  {/* Preview removed from here; now permanently on the left */}
                </Grid>
              </Box>
            )}

            {/* Mission Section */}
            {currentTab === 1 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h5">Mission Section</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={impactReportForm.mission.enabled}
                        onChange={(e) =>
                          handleSectionChange(
                            "mission",
                            "enabled",
                            e.target.checked,
                          )
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: COLORS.gogo_blue,
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: COLORS.gogo_blue,
                            },
                        }}
                      />
                    }
                    label="Enable Section"
                    sx={{ color: "white" }}
                  />
                </Box>
                <Divider sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <CustomTextField
                      label="Section Title"
                      value={impactReportForm.mission.title}
                      onChange={(e) =>
                        handleSectionChange("mission", "title", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField
                      label="Mission Content"
                      value={impactReportForm.mission.content}
                      onChange={(e) =>
                        handleSectionChange(
                          "mission",
                          "content",
                          e.target.value,
                        )
                      }
                      fullWidth
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Mission Image
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload("mission", "image", e)
                        }
                        style={{ display: "none" }}
                        ref={(el) =>
                          (fileInputRefs.current["mission-img"] = el)
                        }
                      />
                      <Button
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        onClick={() =>
                          fileInputRefs.current["mission-img"]?.click()
                        }
                      >
                        Upload Image
                      </Button>
                      {impactReportForm.mission.imagePreview && (
                        <Box
                          sx={{
                            width: 100,
                            height: 60,
                            overflow: "hidden",
                            borderRadius: 1,
                          }}
                        >
                          <img
                            src={impactReportForm.mission.imagePreview}
                            alt="Mission preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Impact Stats Section */}
            {currentTab === 2 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h5">Impact Statistics</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={impactReportForm.impact.enabled}
                        onChange={(e) =>
                          handleSectionChange(
                            "impact",
                            "enabled",
                            e.target.checked,
                          )
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: COLORS.gogo_blue,
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: COLORS.gogo_blue,
                            },
                        }}
                      />
                    }
                    label="Enable Section"
                    sx={{ color: "white" }}
                  />
                </Box>
                <Divider sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <CustomTextField
                      label="Section Title"
                      value={impactReportForm.impact.title}
                      onChange={(e) =>
                        handleSectionChange("impact", "title", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Statistics</Typography>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddStat}
                        variant="outlined"
                        size="small"
                      >
                        Add Statistic
                      </Button>
                    </Box>
                    {impactReportForm.impact.stats.map((stat, index) => (
                      <Card
                        key={stat.id}
                        sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.05)" }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography variant="h6">
                              Statistic {index + 1}
                            </Typography>
                            <IconButton
                              onClick={() => handleRemoveStat(index)}
                              sx={{ color: "rgba(255,255,255,0.7)" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <CustomTextField
                                label="Number"
                                value={stat.number}
                                onChange={(e) =>
                                  handleStatChange(
                                    index,
                                    "number",
                                    e.target.value,
                                  )
                                }
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <CustomTextField
                                label="Label"
                                value={stat.label}
                                onChange={(e) =>
                                  handleStatChange(
                                    index,
                                    "label",
                                    e.target.value,
                                  )
                                }
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Programs Section */}
            {currentTab === 3 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h5">Programs Section</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={impactReportForm.programs.enabled}
                        onChange={(e) =>
                          handleSectionChange(
                            "programs",
                            "enabled",
                            e.target.checked,
                          )
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: COLORS.gogo_blue,
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: COLORS.gogo_blue,
                            },
                        }}
                      />
                    }
                    label="Enable Section"
                    sx={{ color: "white" }}
                  />
                </Box>
                <Divider sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <CustomTextField
                      label="Section Title"
                      value={impactReportForm.programs.title}
                      onChange={(e) =>
                        handleSectionChange("programs", "title", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Programs</Typography>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddProgram}
                        variant="outlined"
                        size="small"
                      >
                        Add Program
                      </Button>
                    </Box>
                    {impactReportForm.programs.programs.map(
                      (program, index) => (
                        <Card
                          key={program.id}
                          sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.05)" }}
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <Typography variant="h6">
                                Program {index + 1}
                              </Typography>
                              <IconButton
                                onClick={() => handleRemoveProgram(index)}
                                sx={{ color: "rgba(255,255,255,0.7)" }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <CustomTextField
                                  label="Program Name"
                                  value={program.name}
                                  onChange={(e) =>
                                    handleProgramChange(
                                      index,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <CustomTextField
                                  label="Description"
                                  value={program.description}
                                  onChange={(e) =>
                                    handleProgramChange(
                                      index,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Program Image
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (readerEvent) => {
                                          handleProgramChange(
                                            index,
                                            "image",
                                            file,
                                          );
                                          handleProgramChange(
                                            index,
                                            "imagePreview",
                                            readerEvent.target
                                              ?.result as string,
                                          );
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    style={{ display: "none" }}
                                    ref={(el) =>
                                      (fileInputRefs.current[
                                        `program-${index}`
                                      ] = el)
                                    }
                                  />
                                  <Button
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                    onClick={() =>
                                      fileInputRefs.current[
                                        `program-${index}`
                                      ]?.click()
                                    }
                                  >
                                    Upload Image
                                  </Button>
                                  {program.imagePreview && (
                                    <Box
                                      sx={{
                                        width: 100,
                                        height: 60,
                                        overflow: "hidden",
                                        borderRadius: 1,
                                      }}
                                    >
                                      <img
                                        src={program.imagePreview}
                                        alt="Program preview"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </Box>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Locations Section */}
            {currentTab === 4 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h5">Locations Section</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={impactReportForm.locations.enabled}
                        onChange={(e) =>
                          handleSectionChange(
                            "locations",
                            "enabled",
                            e.target.checked,
                          )
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: COLORS.gogo_blue,
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: COLORS.gogo_blue,
                            },
                        }}
                      />
                    }
                    label="Enable Section"
                    sx={{ color: "white" }}
                  />
                </Box>
                <Divider sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <CustomTextField
                      label="Section Title"
                      value={impactReportForm.locations.title}
                      onChange={(e) =>
                        handleSectionChange(
                          "locations",
                          "title",
                          e.target.value,
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      color="rgba(255,255,255,0.7)"
                      sx={{ mb: 2 }}
                    >
                      Locations are currently managed through the main locations
                      system. This section will display all active locations.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Testimonials Section */}
            {currentTab === 5 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h5">Testimonials Section</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={impactReportForm.testimonials.enabled}
                        onChange={(e) =>
                          handleSectionChange(
                            "testimonials",
                            "enabled",
                            e.target.checked,
                          )
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: COLORS.gogo_blue,
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: COLORS.gogo_blue,
                            },
                        }}
                      />
                    }
                    label="Enable Section"
                    sx={{ color: "white" }}
                  />
                </Box>
                <Divider sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <CustomTextField
                      label="Section Title"
                      value={impactReportForm.testimonials.title}
                      onChange={(e) =>
                        handleSectionChange(
                          "testimonials",
                          "title",
                          e.target.value,
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Testimonials</Typography>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddTestimonial}
                        variant="outlined"
                        size="small"
                      >
                        Add Testimonial
                      </Button>
                    </Box>
                    {impactReportForm.testimonials.testimonials.map(
                      (testimonial, index) => (
                        <Card
                          key={testimonial.id}
                          sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.05)" }}
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <Typography variant="h6">
                                Testimonial {index + 1}
                              </Typography>
                              <IconButton
                                onClick={() => handleRemoveTestimonial(index)}
                                sx={{ color: "rgba(255,255,255,0.7)" }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={4}>
                                <CustomTextField
                                  label="Name"
                                  value={testimonial.name}
                                  onChange={(e) =>
                                    handleTestimonialChange(
                                      index,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <CustomTextField
                                  label="Role"
                                  value={testimonial.role}
                                  onChange={(e) =>
                                    handleTestimonialChange(
                                      index,
                                      "role",
                                      e.target.value,
                                    )
                                  }
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Photo
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (readerEvent) => {
                                          handleTestimonialChange(
                                            index,
                                            "image",
                                            file,
                                          );
                                          handleTestimonialChange(
                                            index,
                                            "imagePreview",
                                            readerEvent.target
                                              ?.result as string,
                                          );
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    style={{ display: "none" }}
                                    ref={(el) =>
                                      (fileInputRefs.current[
                                        `testimonial-${index}`
                                      ] = el)
                                    }
                                  />
                                  <Button
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                    onClick={() =>
                                      fileInputRefs.current[
                                        `testimonial-${index}`
                                      ]?.click()
                                    }
                                  >
                                    Upload Photo
                                  </Button>
                                  {testimonial.imagePreview && (
                                    <Box
                                      sx={{
                                        width: 50,
                                        height: 50,
                                        overflow: "hidden",
                                        borderRadius: "50%",
                                      }}
                                    >
                                      <img
                                        src={testimonial.imagePreview}
                                        alt="Testimonial preview"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </Box>
                                  )}
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <CustomTextField
                                  label="Testimonial Content"
                                  value={testimonial.content}
                                  onChange={(e) =>
                                    handleTestimonialChange(
                                      index,
                                      "content",
                                      e.target.value,
                                    )
                                  }
                                  fullWidth
                                  multiline
                                  rows={3}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}
          </CustomPaper>
        </Grid>

        {/* General error */}
        {errors.general && (
          <Grid item xs={12}>
            <Typography variant="body2" color="error" align="center">
              {errors.general}
            </Typography>
          </Grid>
        )}
      </Grid>
    </ScreenGrid>
  );
}

export default ImpactReportCustomizationPage;
