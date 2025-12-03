import React, { useState, useMemo } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ColorPickerPopover from "../../components/ColorPickerPopover";
import { CustomTextField } from "../styles";
import {
  GradientEditor,
  parseGradientString,
  composeGradient,
} from "./GradientEditor";
import { PopulationContent, DemographicItem } from "../../services/impact.api";

// Gradient keys for population section
type PopulationGradientKey =
  | "sectionBadgeGradient"
  | "titleGradient"
  | "containerBgGradient";

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

  // Drag state for demographics reordering
  const [draggedDemoIndex, setDraggedDemoIndex] = useState<number | null>(null);
  const [dragOverDemoIndex, setDragOverDemoIndex] = useState<number | null>(
    null,
  );

  // Calculate demographics total for validation
  const demographicsData = population.demographicsData || [];
  const demographicsTotal = useMemo(
    () => demographicsData.reduce((sum, item) => sum + (item.value || 0), 0),
    [demographicsData],
  );
  const demographicsValid = demographicsTotal === 100;

  // Drag handlers for demographics
  const handleDemoDragStart = (index: number) => {
    setDraggedDemoIndex(index);
  };

  const handleDemoDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedDemoIndex !== null && draggedDemoIndex !== index) {
      setDragOverDemoIndex(index);
    }
  };

  const handleDemoDragEnd = () => {
    if (
      draggedDemoIndex !== null &&
      dragOverDemoIndex !== null &&
      draggedDemoIndex !== dragOverDemoIndex
    ) {
      const next = [...demographicsData];
      const [removed] = next.splice(draggedDemoIndex, 1);
      next.splice(dragOverDemoIndex, 0, removed);
      onPopulationChange("demographicsData", next);
    }
    setDraggedDemoIndex(null);
    setDragOverDemoIndex(null);
  };

  // Helper functions for demographics pie items
  const addDemographicItem = () => {
    const newItem: DemographicItem = {
      id: `item-${Date.now()}`,
      label: "",
      value: 0,
      color: "",
    };
    onPopulationChange("demographicsData", [...demographicsData, newItem]);
  };

  const removeDemographicItem = (index: number) => {
    const next = demographicsData.filter((_, i) => i !== index);
    onPopulationChange("demographicsData", next);
  };

  const updateDemographicItem = (
    index: number,
    field: keyof DemographicItem,
    value: string | number,
  ) => {
    const next = [...demographicsData];
    next[index] = { ...next[index], [field]: value };
    // Don't update id when label changes - id should remain stable for React keys
    onPopulationChange("demographicsData", next);
  };

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

  // Compose gradient from legacy fields if full string not available
  const composeFromLegacy = (
    start: string | undefined,
    end: string | undefined,
    degree: number | undefined,
  ): string => {
    if (start && end) {
      return `linear-gradient(${degree ?? 90}deg, ${start}, ${end})`;
    }
    return "";
  };

  // Get gradient values - compose from legacy fields if full string not available
  const getDefaultGradient = (key: PopulationGradientKey): string => {
    switch (key) {
      case "sectionBadgeGradient":
        return (
          population.sectionBadgeGradient ||
          composeFromLegacy(
            population.sectionBadgeGradientStart,
            population.sectionBadgeGradientEnd,
            population.sectionBadgeGradientDegree,
          )
        );
      case "titleGradient":
        return (
          population.titleGradient ||
          composeFromLegacy(
            population.titleGradientStart,
            population.titleGradientEnd,
            population.titleGradientDegree,
          )
        );
      case "containerBgGradient":
        return (
          population.containerBgGradient ||
          composeFromLegacy(
            population.containerBgGradientStart,
            population.containerBgGradientEnd,
            population.containerBgGradientDegree,
          )
        );
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
      demographicsData[populationDemographicPickerIndex]
    ) {
      return demographicsData[populationDemographicPickerIndex].color || "";
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
      // Use demographicsData (derived) to ensure consistency
      const next = [...demographicsData];
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
          <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "rgba(255,255,255,0.9)" }}
          >
            Info Cards
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "stretch",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <CustomTextField
                label="Info Card 1 Text"
                value={population.infoCard1Text || ""}
                onChange={(e) =>
                  onPopulationChange("infoCard1Text", e.target.value)
                }
                fullWidth
                multiline
                minRows={4}
                sx={{
                  flex: 1,
                  "& .MuiInputBase-root": {
                    height: "100%",
                    alignItems: "flex-start",
                    overflow: "hidden",
                  },
                  "& .MuiInputBase-input": {
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    overflowWrap: "anywhere",
                  },
                }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <CustomTextField
                label="Info Card 2 Text"
                value={population.infoCard2Text || ""}
                onChange={(e) =>
                  onPopulationChange("infoCard2Text", e.target.value)
                }
                fullWidth
                multiline
                minRows={4}
                sx={{
                  flex: 1,
                  "& .MuiInputBase-root": {
                    height: "100%",
                    alignItems: "flex-start",
                    overflow: "hidden",
                  },
                  "& .MuiInputBase-input": {
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    overflowWrap: "anywhere",
                  },
                }}
              />
            </Box>
          </Box>
        </Grid>

        {/* Demographics */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.9)" }}>
              Student Demographics
            </Typography>
            {demographicsData.length > 0 && (
              <Typography
                variant="caption"
                sx={{
                  color: demographicsValid
                    ? "rgba(255,255,255,0.5)"
                    : "#FF8A80",
                }}
              >
                Total: {demographicsTotal}%{" "}
                {!demographicsValid && "(must equal 100%)"}
              </Typography>
            )}
          </Box>

          {/* Validation Warning - only show when there are items */}
          {demographicsData.length > 0 && !demographicsValid && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Demographics pie chart must add up to 100% to display correctly.
              Current total: {demographicsTotal}%
            </Alert>
          )}

          <CustomTextField
            label="Chart Title"
            value={population.demographicsTitle || ""}
            onChange={(e) =>
              onPopulationChange("demographicsTitle", e.target.value)
            }
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* No data message */}
          {demographicsData.length === 0 && (
            <Box
              sx={{
                p: 3,
                mb: 2,
                bgcolor: "rgba(255,255,255,0.03)",
                borderRadius: 2,
                border: "1px dashed rgba(255,255,255,0.2)",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.5)", mb: 1 }}
              >
                No demographics data configured
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.3)" }}
              >
                Click "Add Category" below to add demographic categories
              </Typography>
            </Box>
          )}

          {demographicsData.map((demo, idx) => {
            const isDragging = draggedDemoIndex === idx;
            const isDragOver = dragOverDemoIndex === idx;

            return (
              <Box
                key={demo.id || idx}
                draggable
                onDragStart={() => handleDemoDragStart(idx)}
                onDragOver={(e) => handleDemoDragOver(e, idx)}
                onDragEnd={handleDemoDragEnd}
                sx={{
                  mb: 2,
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  p: 2,
                  bgcolor: "rgba(255,255,255,0.03)",
                  borderRadius: 2,
                  border: isDragOver
                    ? "2px dashed rgba(30, 215, 96, 0.8)"
                    : "1px solid rgba(255,255,255,0.08)",
                  opacity: isDragging ? 0.5 : 1,
                  cursor: "grab",
                  transition: "border 0.15s ease",
                }}
              >
                <DragIndicatorIcon
                  sx={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }}
                />
                <CustomTextField
                  label="Label"
                  value={demo.label}
                  onChange={(e) =>
                    updateDemographicItem(idx, "label", e.target.value)
                  }
                  sx={{ flex: 2 }}
                />
                <CustomTextField
                  label="Value (%)"
                  type="number"
                  value={demo.value}
                  onChange={(e) =>
                    updateDemographicItem(idx, "value", Number(e.target.value))
                  }
                  sx={{ width: 100 }}
                />
                <Button
                  variant="outlined"
                  onClick={(e) => {
                    setPopulationDemographicPickerIndex(idx);
                    setPopulationColorPickerAnchor(e.currentTarget);
                  }}
                  sx={{
                    borderColor: isColorMissing(demo.color)
                      ? "rgba(244, 67, 54, 0.7)"
                      : "rgba(255,255,255,0.3)",
                    color: "white",
                    textTransform: "none",
                    minWidth: 50,
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: demo.color || "transparent",
                      border: isColorMissing(demo.color)
                        ? "1px solid rgba(244, 67, 54, 0.5)"
                        : "1px solid rgba(255,255,255,0.3)",
                    }}
                  />
                </Button>
                <IconButton
                  onClick={() => removeDemographicItem(idx)}
                  sx={{ color: "rgba(255,255,255,0.5)" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}

          {/* Add Category button */}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addDemographicItem}
            sx={{ borderColor: "rgba(255,255,255,0.3)", color: "white", mb: 2 }}
          >
            Add Category
          </Button>

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
              // Split and trim, but don't filter during editing - allows typing commas
              onPopulationChange(
                "skillsList",
                e.target.value.split(",").map((s) => s.trim()),
              )
            }
            onBlur={(e) =>
              // Filter out empty values on blur (when user is done typing)
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
