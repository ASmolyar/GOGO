import React, { useState } from 'react';
import { Grid, Box, Typography, Button, Divider } from '@mui/material';
import ColorPickerPopover from '../../components/ColorPickerPopover';
import { CustomTextField } from '../styles';
import { GradientEditor, parseGradientString, composeGradient } from './GradientEditor';
import { PopulationContent } from "../../services/impact.api";

// Gradient keys for population section
type PopulationGradientKey = 'sectionBadgeGradient' | 'titleGradient' | 'containerBgGradient';

export interface PopulationTabEditorProps {
  population: PopulationContent;
  defaultSwatch: string[] | null;
  onPopulationChange: (field: keyof PopulationContent, value: any) => void;
}

export function PopulationTabEditor({
  population,
  defaultSwatch,
  onPopulationChange,
}: PopulationTabEditorProps) {
  const [populationColorPickerAnchor, setPopulationColorPickerAnchor] =
    useState<HTMLElement | null>(null);
  const [populationColorPickerField, setPopulationColorPickerField] = useState<
    keyof PopulationContent | null
  >(null);
  const [
    populationDemographicPickerIndex,
    setPopulationDemographicPickerIndex,
  ] = useState<number | null>(null);
  const [populationCgasStatPickerIndex, setPopulationCgasStatPickerIndex] =
    useState<number | null>(null);

  // State for gradient color picker
  const [gradientPickerAnchor, setGradientPickerAnchor] =
    useState<HTMLElement | null>(null);
  const [gradientPickerKey, setGradientPickerKey] =
    useState<PopulationGradientKey | null>(null);
  const [gradientPickerColorIndex, setGradientPickerColorIndex] =
    useState<number>(0);
  const gradientPickerOpen = Boolean(gradientPickerAnchor);

  // Helper to check if a gradient is missing
  const isGradientMissing = (value: string | null | undefined): boolean =>
    !value || value.trim() === "";

  // Helper to check if a color field is missing (null, undefined, or empty string)
  const isColorMissing = (value: string | null | undefined): boolean =>
    !value || value.trim() === "";

  // Style for buttons with missing values
  const missingFieldStyle = {
    borderColor: "rgba(244, 67, 54, 0.7)",
    color: "rgba(244, 67, 54, 0.9)",
    "&:hover": { borderColor: "#f44336" },
  };

  const normalFieldStyle = {
    borderColor: "rgba(255,255,255,0.3)",
    color: "rgba(255,255,255,0.9)",
  };

  const getColorButtonStyle = (value: string | null | undefined) =>
    isColorMissing(value) ? missingFieldStyle : normalFieldStyle;

  // Get gradient values - only returns what's in the database (no defaults)
  const getDefaultGradient = (key: PopulationGradientKey): string => {
    switch (key) {
      case "sectionBadgeGradient":
        return population.sectionBadgeGradient || "";
      case "titleGradient":
        return population.titleGradient || "";
      case "containerBgGradient":
        return population.containerBgGradient || "";
      default:
        return "";
    }
  };

  // Get current gradient color for the picker
  const getGradientPickerColor = (): string => {
    if (!gradientPickerKey) return "";
    const gradient = getDefaultGradient(gradientPickerKey);
    const parsed = parseGradientString(gradient);
    return parsed.colors[gradientPickerColorIndex] || "";
  };

  const openGradientPicker = (
    el: HTMLElement,
    key: PopulationGradientKey,
    colorIndex: number,
  ) => {
    setGradientPickerKey(key);
    setGradientPickerColorIndex(colorIndex);
    setGradientPickerAnchor(el);
  };

  const handleGradientColorChange = (val: string) => {
    if (!gradientPickerKey) return;
    const currentGradient = getDefaultGradient(gradientPickerKey);
    const parsed = parseGradientString(currentGradient);
    const newColors = [...parsed.colors];
    newColors[gradientPickerColorIndex] = val;
    const newGradient = composeGradient(
      parsed.type,
      parsed.degree,
      newColors,
      parsed.opacity,
    );
    onPopulationChange(gradientPickerKey, newGradient);
  };

  const getPickerValue = (): string => {
    if (
      populationDemographicPickerIndex !== null &&
      population.demographicsData?.[populationDemographicPickerIndex]
    ) {
      return (
        population.demographicsData[populationDemographicPickerIndex].color ||
        ""
      );
    }
    if (
      populationCgasStatPickerIndex !== null &&
      population.cgasStats?.[populationCgasStatPickerIndex]
    ) {
      return population.cgasStats[populationCgasStatPickerIndex].color || "";
    }
    if (populationColorPickerField) {
      return (population[populationColorPickerField] as string) || "";
    }
    return "";
  };

  const handlePickerChange = (val: string) => {
    if (populationDemographicPickerIndex !== null) {
      const next = [...(population.demographicsData || [])];
      if (next[populationDemographicPickerIndex]) {
        next[populationDemographicPickerIndex] = {
          ...next[populationDemographicPickerIndex],
          color: val,
        };
        onPopulationChange("demographicsData", next);
      }
    } else if (populationCgasStatPickerIndex !== null) {
      const next = [...(population.cgasStats || [])];
      if (next[populationCgasStatPickerIndex]) {
        next[populationCgasStatPickerIndex] = {
          ...next[populationCgasStatPickerIndex],
          color: val,
        };
        onPopulationChange("cgasStats", next);
      }
    } else if (populationColorPickerField) {
      onPopulationChange(populationColorPickerField, val);
    }
  };

  return (
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
            fontFamily: "'Airwaves', 'Century Gothic', 'Arial', sans-serif",
          }}
        >
          Population Section
        </Typography>
      </Box>
      <Divider sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Section Header */}
        <Grid item xs={12}>
          <CustomTextField
            label="Badge Label"
            value={population.sectionBadge || ""}
            onChange={(e) => onPopulationChange("sectionBadge", e.target.value)}
            fullWidth
          />
          <Box sx={{ mt: 3 }}>
            <GradientEditor
              label="Badge Gradient"
              value={getDefaultGradient("sectionBadgeGradient")}
              onChange={(gradient) =>
                onPopulationChange("sectionBadgeGradient", gradient)
              }
              onPickColor={(el, colorIndex) =>
                openGradientPicker(el, "sectionBadgeGradient", colorIndex)
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            label="Section Title"
            value={population.sectionTitle || ""}
            onChange={(e) => onPopulationChange("sectionTitle", e.target.value)}
            fullWidth
          />
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.7)",
                mb: 1,
                display: "block",
              }}
            >
              Horizontal Line Color
            </Typography>
            <Button
              variant="outlined"
              onClick={(e) => {
                setPopulationColorPickerField("sectionTitleUnderlineColor");
                setPopulationColorPickerAnchor(e.currentTarget);
              }}
              sx={{
                ...getColorButtonStyle(population.sectionTitleUnderlineColor),
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  background:
                    population.sectionTitleUnderlineColor || "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  marginRight: 8,
                }}
              />
              Pick Color
            </Button>
          </Box>
        </Grid>

        {/* Main Title */}
        <Grid item xs={12}>
          <CustomTextField
            label="Main Title"
            value={population.title || ""}
            onChange={(e) => onPopulationChange("title", e.target.value)}
            fullWidth
            multiline
          />
          <Box sx={{ mt: 3 }}>
            <GradientEditor
              label="Title Gradient"
              value={getDefaultGradient("titleGradient")}
              onChange={(gradient) =>
                onPopulationChange("titleGradient", gradient)
              }
              onPickColor={(el, colorIndex) =>
                openGradientPicker(el, "titleGradient", colorIndex)
              }
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.7)",
                mb: 1,
                display: "block",
              }}
            >
              Animated Underline Color
            </Typography>
            <Button
              variant="outlined"
              onClick={(e) => {
                setPopulationColorPickerField("titleUnderlineColor");
                setPopulationColorPickerAnchor(e.currentTarget);
              }}
              sx={{
                ...getColorButtonStyle(population.titleUnderlineColor),
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  background: population.titleUnderlineColor || "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  marginRight: 8,
                }}
              />
              Pick Color
            </Button>
          </Box>
        </Grid>

        {/* Info Cards */}
        <Grid item xs={12}>
          <CustomTextField
            label="Info Card 1 Text"
            value={population.infoCard1Text || ""}
            onChange={(e) =>
              onPopulationChange("infoCard1Text", e.target.value)
            }
            fullWidth
            multiline
            minRows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            label="Info Card 2 Text"
            value={population.infoCard2Text || ""}
            onChange={(e) =>
              onPopulationChange("infoCard2Text", e.target.value)
            }
            fullWidth
            multiline
            minRows={3}
          />
        </Grid>

        {/* Demographics */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Demographics
          </Typography>
          <CustomTextField
            label="Chart Title"
            value={population.demographicsTitle || ""}
            onChange={(e) =>
              onPopulationChange("demographicsTitle", e.target.value)
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          {population.demographicsData?.map((demo, idx) => (
            <Box
              key={idx}
              sx={{
                mb: 2,
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <CustomTextField
                label="Label"
                value={demo.label}
                onChange={(e) => {
                  const next = [...(population.demographicsData || [])];
                  next[idx] = {
                    ...next[idx],
                    label: e.target.value,
                    id: e.target.value,
                  };
                  onPopulationChange("demographicsData", next);
                }}
                sx={{ flex: 1 }}
              />
              <CustomTextField
                label="Value %"
                type="number"
                value={demo.value}
                onChange={(e) => {
                  const next = [...(population.demographicsData || [])];
                  next[idx] = {
                    ...next[idx],
                    value: Number(e.target.value),
                  };
                  onPopulationChange("demographicsData", next);
                }}
                sx={{ width: 100 }}
              />
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 4,
                  background: demo.color,
                  border: "1px solid rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                onClick={(e) => {
                  setPopulationDemographicPickerIndex(idx);
                  setPopulationColorPickerAnchor(e.currentTarget);
                }}
              />
            </Box>
          ))}
          <CustomTextField
            label="Caption"
            value={population.demographicsCaption || ""}
            onChange={(e) =>
              onPopulationChange("demographicsCaption", e.target.value)
            }
            fullWidth
          />
        </Grid>

        {/* Stats */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Impact Stats
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Stat 1
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <CustomTextField
                label="Percent"
                type="number"
                value={population.stat1Percent || 0}
                onChange={(e) =>
                  onPopulationChange("stat1Percent", Number(e.target.value))
                }
                sx={{ width: 100 }}
              />
              <CustomTextField
                label="Text"
                value={population.stat1Text || ""}
                onChange={(e) =>
                  onPopulationChange("stat1Text", e.target.value)
                }
                fullWidth
              />
              <Box>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mb: 0.5 }}
                >
                  Color
                </Typography>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    background: population.stat1Color || "transparent",
                    border: isColorMissing(population.stat1Color)
                      ? "2px solid rgba(244, 67, 54, 0.7)"
                      : "1px solid rgba(255,255,255,0.3)",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    setPopulationColorPickerField("stat1Color");
                    setPopulationColorPickerAnchor(e.currentTarget);
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Stat 2
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <CustomTextField
                label="Percent"
                type="number"
                value={population.stat2Percent || 0}
                onChange={(e) =>
                  onPopulationChange("stat2Percent", Number(e.target.value))
                }
                sx={{ width: 100 }}
              />
              <CustomTextField
                label="Text"
                value={population.stat2Text || ""}
                onChange={(e) =>
                  onPopulationChange("stat2Text", e.target.value)
                }
                fullWidth
              />
              <Box>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mb: 0.5 }}
                >
                  Color
                </Typography>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    background: population.stat2Color || "transparent",
                    border: isColorMissing(population.stat2Color)
                      ? "2px solid rgba(244, 67, 54, 0.7)"
                      : "1px solid rgba(255,255,255,0.3)",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    setPopulationColorPickerField("stat2Color");
                    setPopulationColorPickerAnchor(e.currentTarget);
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* C-GAS */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            C-GAS
          </Typography>
          <CustomTextField
            label="Section Title"
            value={population.cgasTitle || ""}
            onChange={(e) => onPopulationChange("cgasTitle", e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <CustomTextField
            label="Tooltip Text"
            value={population.cgasTooltip || ""}
            onChange={(e) => onPopulationChange("cgasTooltip", e.target.value)}
            fullWidth
            multiline
            minRows={2}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            {population.cgasStats?.map((stat, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 2,
                  }}
                >
                  <CustomTextField
                    label="Value"
                    value={stat.value}
                    onChange={(e) => {
                      const next = [...(population.cgasStats || [])];
                      next[idx] = {
                        ...next[idx],
                        value: e.target.value,
                      };
                      onPopulationChange("cgasStats", next);
                    }}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <CustomTextField
                    label="Label"
                    value={stat.label}
                    onChange={(e) => {
                      const next = [...(population.cgasStats || [])];
                      next[idx] = {
                        ...next[idx],
                        label: e.target.value,
                      };
                      onPopulationChange("cgasStats", next);
                    }}
                    fullWidth
                    multiline
                    minRows={2}
                    sx={{ mb: 1 }}
                  />
                  <div
                    style={{
                      width: "100%",
                      height: 30,
                      borderRadius: 4,
                      background: stat.color,
                      border: "1px solid rgba(255,255,255,0.3)",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      setPopulationCgasStatPickerIndex(idx);
                      setPopulationColorPickerAnchor(e.currentTarget);
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Skills */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Skills
          </Typography>
          <CustomTextField
            label="Skills Title"
            value={population.skillsTitle || ""}
            onChange={(e) => onPopulationChange("skillsTitle", e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <CustomTextField
            label="Skills (Comma Separated)"
            value={(population.skillsList || []).join(", ")}
            onChange={(e) =>
              onPopulationChange(
                "skillsList",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            fullWidth
            multiline
            minRows={3}
          />
        </Grid>

        {/* Background Glows */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Background Glows
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Blob 1 Inner
              </Typography>
              <Button
                size="medium"
                variant="outlined"
                fullWidth
                onClick={(e) => {
                  setPopulationColorPickerField("blob1ColorA");
                  setPopulationColorPickerAnchor(e.currentTarget);
                }}
                sx={{
                  ...getColorButtonStyle(population.blob1ColorA),
                  justifyContent: "flex-start",
                  height: 40,
                  px: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: 0.5,
                    bgcolor: population.blob1ColorA || "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    mr: 1.5,
                  }}
                />
                Pick
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Blob 1 Outer
              </Typography>
              <Button
                size="medium"
                variant="outlined"
                fullWidth
                onClick={(e) => {
                  setPopulationColorPickerField("blob1ColorB");
                  setPopulationColorPickerAnchor(e.currentTarget);
                }}
                sx={{
                  ...getColorButtonStyle(population.blob1ColorB),
                  justifyContent: "flex-start",
                  height: 40,
                  px: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: 0.5,
                    bgcolor: population.blob1ColorB || "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    mr: 1.5,
                  }}
                />
                Pick
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Blob 2 Inner
              </Typography>
              <Button
                size="medium"
                variant="outlined"
                fullWidth
                onClick={(e) => {
                  setPopulationColorPickerField("blob2ColorA");
                  setPopulationColorPickerAnchor(e.currentTarget);
                }}
                sx={{
                  ...getColorButtonStyle(population.blob2ColorA),
                  justifyContent: "flex-start",
                  height: 40,
                  px: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: 0.5,
                    bgcolor: population.blob2ColorA || "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    mr: 1.5,
                  }}
                />
                Pick
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Blob 2 Outer
              </Typography>
              <Button
                size="medium"
                variant="outlined"
                fullWidth
                onClick={(e) => {
                  setPopulationColorPickerField("blob2ColorB");
                  setPopulationColorPickerAnchor(e.currentTarget);
                }}
                sx={{
                  ...getColorButtonStyle(population.blob2ColorB),
                  justifyContent: "flex-start",
                  height: 40,
                  px: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: 0.5,
                    bgcolor: population.blob2ColorB || "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    mr: 1.5,
                  }}
                />
                Pick
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Container Background */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Container Background
          </Typography>
          <GradientEditor
            label="Container Gradient"
            value={getDefaultGradient("containerBgGradient")}
            onChange={(gradient) =>
              onPopulationChange("containerBgGradient", gradient)
            }
            onPickColor={(el, colorIndex) =>
              openGradientPicker(el, "containerBgGradient", colorIndex)
            }
          />
        </Grid>

        {/* Container Overlay Radials */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Container Overlay Radials
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={(e) => {
                setPopulationColorPickerField("containerOverlayColor1");
                setPopulationColorPickerAnchor(e.currentTarget);
              }}
              sx={getColorButtonStyle(population.containerOverlayColor1)}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  background:
                    population.containerOverlayColor1 || "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  marginRight: 8,
                }}
              />
              Overlay 1 (top-left)
            </Button>
            <Button
              variant="outlined"
              onClick={(e) => {
                setPopulationColorPickerField("containerOverlayColor2");
                setPopulationColorPickerAnchor(e.currentTarget);
              }}
              sx={getColorButtonStyle(population.containerOverlayColor2)}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  background:
                    population.containerOverlayColor2 || "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  marginRight: 8,
                }}
              />
              Overlay 2 (bottom-right)
            </Button>
          </Box>
        </Grid>

        {/* Card Backgrounds */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Card Styling
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Info Card Background
              </Typography>
              <Button
                variant="outlined"
                onClick={(e) => {
                  setPopulationColorPickerField("infoCardBgColor");
                  setPopulationColorPickerAnchor(e.currentTarget);
                }}
                sx={getColorButtonStyle(population.infoCardBgColor)}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    background: population.infoCardBgColor || "transparent",
                    border: "1px solid rgba(255,255,255,0.3)",
                    marginRight: 8,
                  }}
                />
                Pick Color
              </Button>
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Bento Card Background
              </Typography>
              <Button
                variant="outlined"
                onClick={(e) => {
                  setPopulationColorPickerField("bentoCardBgColor");
                  setPopulationColorPickerAnchor(e.currentTarget);
                }}
                sx={getColorButtonStyle(population.bentoCardBgColor)}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    background: population.bentoCardBgColor || "transparent",
                    border: "1px solid rgba(255,255,255,0.3)",
                    marginRight: 8,
                  }}
                />
                Pick Color
              </Button>
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Percent Circle Inner
              </Typography>
              <Button
                variant="outlined"
                onClick={(e) => {
                  setPopulationColorPickerField("percentCircleInnerBgColor");
                  setPopulationColorPickerAnchor(e.currentTarget);
                }}
                sx={getColorButtonStyle(population.percentCircleInnerBgColor)}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    background:
                      population.percentCircleInnerBgColor || "transparent",
                    border: "1px solid rgba(255,255,255,0.3)",
                    marginRight: 8,
                  }}
                />
                Pick Color
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Skill Chip Styling */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Skill Chip Styling
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Chip Text Color
              </Typography>
              <Button
                variant="outlined"
                onClick={(e) => {
                  setPopulationColorPickerField("skillChipTextColor");
                  setPopulationColorPickerAnchor(e.currentTarget);
                }}
                sx={getColorButtonStyle(population.skillChipTextColor)}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    background: population.skillChipTextColor || "transparent",
                    border: "1px solid rgba(255,255,255,0.3)",
                    marginRight: 8,
                  }}
                />
                Pick Color
              </Button>
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Chip Background
              </Typography>
              <Button
                variant="outlined"
                onClick={(e) => {
                  setPopulationColorPickerField("skillChipBgColor");
                  setPopulationColorPickerAnchor(e.currentTarget);
                }}
                sx={getColorButtonStyle(population.skillChipBgColor)}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    background: population.skillChipBgColor || "transparent",
                    border: "1px solid rgba(255,255,255,0.3)",
                    marginRight: 8,
                  }}
                />
                Pick Color
              </Button>
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Chip Border
              </Typography>
              <Button
                variant="outlined"
                onClick={(e) => {
                  setPopulationColorPickerField("skillChipBorderColor");
                  setPopulationColorPickerAnchor(e.currentTarget);
                }}
                sx={getColorButtonStyle(population.skillChipBorderColor)}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    background:
                      population.skillChipBorderColor || "transparent",
                    border: "1px solid rgba(255,255,255,0.3)",
                    marginRight: 8,
                  }}
                />
                Pick Color
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Shared Color Picker for simple fields */}
      <ColorPickerPopover
        open={Boolean(populationColorPickerAnchor)}
        anchorEl={populationColorPickerAnchor}
        onClose={() => {
          setPopulationColorPickerAnchor(null);
          setPopulationColorPickerField(null);
          setPopulationDemographicPickerIndex(null);
          setPopulationCgasStatPickerIndex(null);
        }}
        value={getPickerValue()}
        onChange={handlePickerChange}
        presets={defaultSwatch ?? undefined}
      />

      {/* Gradient Color Picker */}
      <ColorPickerPopover
        open={gradientPickerOpen}
        anchorEl={gradientPickerAnchor}
        onClose={() => {
          setGradientPickerAnchor(null);
          setGradientPickerKey(null);
        }}
        value={getGradientPickerColor()}
        onChange={handleGradientColorChange}
        presets={defaultSwatch ?? undefined}
      />
    </Box>
  );
}

export default PopulationTabEditor;

