import React, { useEffect, useState } from "react";
import { Popover, Box, Button, InputBase } from "@mui/material";
import { HexColorPicker } from "react-colorful";
import ColorizeIcon from "@mui/icons-material/Colorize";
import COLORS from "../../assets/colors";

export interface ColorPickerPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  value: string;
  onChange: (hex: string) => void;
  presets?: string[];
}

function ColorPickerPopover(props: ColorPickerPopoverProps) {
  const { open, anchorEl, onClose, value, onChange, presets } = props;

  const brandPresets = presets ?? [
    COLORS.gogo_blue,
    COLORS.gogo_purple,
    COLORS.gogo_teal,
    COLORS.gogo_yellow,
    COLORS.gogo_pink,
    COLORS.gogo_green,
  ];

  const canUseDropper =
    typeof window !== "undefined" && typeof (window as any).EyeDropper === "function";

  const [hexInput, setHexInput] = useState<string>("#000000");

  useEffect(() => {
    const v = typeof value === "string" ? value : "#000000";
    const normalized = v.startsWith("#") ? v : `#${v}`;
    setHexInput(normalized.toUpperCase());
  }, [value]);

  const expandShortHex = (raw: string) => {
    if (raw.length === 3) {
      return raw
        .split("")
        .map((c) => c + c)
        .join("");
    }
    return raw;
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    const withoutHash = next.startsWith("#") ? next.slice(1) : next;
    const cleaned = withoutHash.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
    const display = `#${cleaned}`.toUpperCase();
    setHexInput(display);

    if (cleaned.length === 3 || cleaned.length === 6) {
      const expanded = expandShortHex(cleaned).toLowerCase();
      onChange(`#${expanded}`);
    }
  };

  const handleHexInputBlur = () => {
    const raw = hexInput.replace("#", "");
    if (!raw) {
      setHexInput("#000000");
      onChange("#000000");
      return;
    }
    const cleaned = raw.replace(/[^0-9a-fA-F]/g, "");
    const expanded = expandShortHex(cleaned.padEnd(6, cleaned.slice(-1) || "0")).slice(0, 6);
    const normalized = `#${expanded}`.toLowerCase();
    setHexInput(normalized.toUpperCase());
    onChange(normalized);
  };

  const handleEyeDropperPick = async () => {
    try {
      if (!canUseDropper) return;
      const eye = new (window as any).EyeDropper();
      const { sRGBHex } = await eye.open();
      onChange(sRGBHex);
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        // eslint-disable-next-line no-console
        console.warn("EyeDropper failed", err);
      }
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        sx: {
          bgcolor: "rgba(21,24,33,0.6)",
          border: "1px solid rgba(255,255,255,0.12)",
          WebkitBackdropFilter: "blur(10px) saturate(140%)",
          backdropFilter: "blur(10px) saturate(140%)",
          p: 2,
          width: { xs: 260, sm: 320 },
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
          {brandPresets.map((c) => (
            <button
              key={`preset-${c}`}
              onClick={() => onChange(c)}
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.25)",
                background: c,
                cursor: "pointer",
              }}
              aria-label={`Use ${c}`}
              title={c}
            />
          ))}
          <span style={{ flex: 1 }} />
          <Button
            size="small"
            variant="outlined"
            onClick={handleEyeDropperPick}
            disabled={!canUseDropper}
            sx={{
              borderColor: "rgba(255,255,255,0.3)",
              color: "rgba(255,255,255,0.9)",
              minWidth: 36,
              px: 0.5,
              height: 30,
            }}
            aria-label="Pick color from screen"
          >
            <ColorizeIcon fontSize="small" />
          </Button>
        </Box>
        <Box sx={{ width: "100%" }}>
          <HexColorPicker color={value} onChange={onChange} style={{ width: "100%" }} />
        </Box>
        <Box sx={{ mt: 0.5 }}>
          <InputBase
            value={hexInput}
            onChange={handleHexInputChange}
            onBlur={handleHexInputBlur}
            inputProps={{ "aria-label": "Hex color", spellCheck: false }}
            sx={{
              width: "100%",
              fontSize: 12,
              px: 1,
              py: 0.5,
              height: 28,
              color: "rgba(255,255,255,0.92)",
              bgcolor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 1,
            }}
            placeholder="#RRGGBB"
          />
        </Box>
      </Box>
    </Popover>
  );
}

export default ColorPickerPopover;


