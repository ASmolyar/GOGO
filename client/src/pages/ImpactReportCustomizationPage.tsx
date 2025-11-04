import React, { useState, useRef } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';
import { v4 as uuidv4 } from 'uuid';
import ScreenGrid from '../components/ScreenGrid.tsx';
import COLORS from '../assets/colors.ts';
import styled from 'styled-components';

// Styled components for dark theme
const CustomPaper = styled(Paper)`
  background: #121212;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
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

// Impact Report Section Types
interface HeroSection {
    title: string;
    subtitle: string;
    backgroundImage: File | null;
    backgroundImagePreview: string | null;
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
    // Current tab state
    const [currentTab, setCurrentTab] = useState(0);

    // Impact report form state with default values
    const [impactReportForm, setImpactReportForm] = useState<ImpactReportForm>({
        hero: {
            title: 'Transforming Lives Through Music',
            subtitle:
                'Connecting youth with professional musician mentors to help them overcome hardship and reach their potential',
            backgroundImage: null,
            backgroundImagePreview: null,
            enabled: true,
        },
        mission: {
            title: 'Our Mission',
            content:
                'Guitars Over Guns is a 501(c)(3) organization that connects youth with professional musician mentors to help them overcome hardship, find their voice and reach their potential through music, art and mentorship.',
            image: null,
            imagePreview: null,
            enabled: true,
        },
        impact: {
            title: 'Our Impact',
            stats: [
                { id: '1', number: '500+', label: 'Students Served' },
                { id: '2', number: '15', label: 'Years of Service' },
                { id: '3', number: '95%', label: 'Graduation Rate' },
                { id: '4', number: '4', label: 'Cities' },
            ],
            enabled: true,
        },
        programs: {
            title: 'Our Programs',
            programs: [
                {
                    id: '1',
                    name: 'Music Mentorship',
                    description: 'One-on-one mentorship with professional musicians',
                    image: null,
                    imagePreview: null,
                },
                {
                    id: '2',
                    name: 'Group Sessions',
                    description: 'Collaborative learning in small groups',
                    image: null,
                    imagePreview: null,
                },
            ],
            enabled: true,
        },
        locations: {
            title: 'Our Locations',
            locations: [
                {
                    id: '1',
                    name: 'Miami',
                    address: 'Miami, FL',
                    coordinates: { lat: 25.7617, lng: -80.1918 },
                },
                {
                    id: '2',
                    name: 'Chicago',
                    address: 'Chicago, IL',
                    coordinates: { lat: 41.8781, lng: -87.6298 },
                },
            ],
            enabled: true,
        },
        testimonials: {
            title: 'What Our Students Say',
            testimonials: [
                {
                    id: '1',
                    name: 'Maria Rodriguez',
                    role: 'Student, Miami',
                    content:
                        'Guitars Over Guns changed my life. I found my voice through music.',
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
    }>({
        general: '',
    });

    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Refs for file inputs
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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
    };

    // Handle image upload
    const handleImageUpload = (
        section: keyof ImpactReportForm,
        field: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                setImpactReportForm((prev) => ({
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: file,
                        [`${field}Preview`]: readerEvent.target?.result as string,
                    },
                }));
            };
            reader.readAsDataURL(file);
        }
    };

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
        handleSectionChange('impact', 'stats', updatedStats);
    };

    // Add stat
    const handleAddStat = () => {
        const newStat = {
            id: uuidv4(),
            number: '',
            label: '',
        };
        handleSectionChange('impact', 'stats', [
            ...impactReportForm.impact.stats,
            newStat,
        ]);
    };

    // Remove stat
    const handleRemoveStat = (index: number) => {
        const updatedStats = impactReportForm.impact.stats.filter(
            (_, i) => i !== index,
        );
        handleSectionChange('impact', 'stats', updatedStats);
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
        handleSectionChange('programs', 'programs', updatedPrograms);
    };

    // Add program
    const handleAddProgram = () => {
        const newProgram = {
            id: uuidv4(),
            name: '',
            description: '',
            image: null,
            imagePreview: null,
        };
        handleSectionChange('programs', 'programs', [
            ...impactReportForm.programs.programs,
            newProgram,
        ]);
    };

    // Remove program
    const handleRemoveProgram = (index: number) => {
        const updatedPrograms = impactReportForm.programs.programs.filter(
            (_, i) => i !== index,
        );
        handleSectionChange('programs', 'programs', updatedPrograms);
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
        handleSectionChange('testimonials', 'testimonials', updatedTestimonials);
    };

    // Add testimonial
    const handleAddTestimonial = () => {
        const newTestimonial = {
            id: uuidv4(),
            name: '',
            role: '',
            content: '',
            image: null,
            imagePreview: null,
        };
        handleSectionChange('testimonials', 'testimonials', [
            ...impactReportForm.testimonials.testimonials,
            newTestimonial,
        ]);
    };

    // Remove testimonial
    const handleRemoveTestimonial = (index: number) => {
        const updatedTestimonials =
            impactReportForm.testimonials.testimonials.filter((_, i) => i !== index);
        handleSectionChange('testimonials', 'testimonials', updatedTestimonials);
    };

    // Handle form submission
    const handleSave = async () => {
        setIsSubmitting(true);

        try {
            // For demo purposes, just log the form data
            console.log('Impact Report data:', impactReportForm);

            // Show success message
            alert('Impact Report saved successfully!');
        } catch (error) {
            console.error('Error saving impact report:', error);
            setErrors((prev) => ({
                ...prev,
                general: 'An error occurred while saving. Please try again.',
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle preview toggle
    const handlePreview = () => {
        setShowPreview(!showPreview);
    };

    // Tab configuration
    const tabs = [
        { label: 'Hero Section', value: 0 },
        { label: 'Mission', value: 1 },
        { label: 'Impact Stats', value: 2 },
        { label: 'Programs', value: 3 },
        { label: 'Locations', value: 4 },
        { label: 'Testimonials', value: 5 },
    ];

    return (
        <ScreenGrid>
            <Grid item>
                <Typography
                    variant="h2"
                    color="white"
                    sx={{ mb: 1, textAlign: 'center' }}
                >
                    Customize Impact Report
                </Typography>
                <Typography
                    variant="subtitle1"
                    color="white"
                    sx={{ mb: 3, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}
                >
                    Customize all sections of the impact report to match your
                    organization's needs
                </Typography>
            </Grid>

            <Grid
                item
                container
                spacing={{ xs: 2, md: 3 }}
                sx={{ maxWidth: 1400, margin: '0 auto', px: { xs: 1, sm: 2, md: 3 } }}
            >
                {/* Action buttons */}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: { xs: 'center', sm: 'space-between' },
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                                disabled={isSubmitting}
                                sx={{
                                    bgcolor: COLORS.gogo_blue,
                                    '&:hover': { bgcolor: '#0066cc' },
                                    minWidth: { xs: '100%', sm: 'auto' },
                                }}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<PreviewIcon />}
                                onClick={handlePreview}
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    minWidth: { xs: '100%', sm: 'auto' },
                                }}
                            >
                                {showPreview ? 'Hide Preview' : 'Show Preview'}
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                {/* Tabs */}
                <Grid item xs={12}>
                    <CustomPaper sx={{ p: 0, overflow: 'hidden' }}>
                        <Tabs
                            value={currentTab}
                            onChange={(_, newValue) => setCurrentTab(newValue)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                '& .MuiTab-root': {
                                    color: 'rgba(255,255,255,0.7)',
                                    minWidth: { xs: 'auto', sm: 120 },
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    '&.Mui-selected': {
                                        color: COLORS.gogo_blue,
                                    },
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: COLORS.gogo_blue,
                                },
                            }}
                        >
                            {tabs.map((tab) => (
                                <Tab key={tab.value} label={tab.label} value={tab.value} />
                            ))}
                        </Tabs>
                    </CustomPaper>
                </Grid>

                {/* Tab content */}
                <Grid item xs={12}>
                    <CustomPaper
                        sx={{
                            p: { xs: 2, sm: 3 },
                            minHeight: { xs: 400, md: 600 },
                            overflow: 'auto',
                        }}
                    >
                        {/* Hero Section */}
                        {currentTab === 0 && (
                            <Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 3,
                                    }}
                                >
                                    <Typography variant="h5">Hero Section</Typography>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={impactReportForm.hero.enabled}
                                                onChange={(e) =>
                                                    handleSectionChange(
                                                        'hero',
                                                        'enabled',
                                                        e.target.checked,
                                                    )
                                                }
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: COLORS.gogo_blue,
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                                    {
                                                        backgroundColor: COLORS.gogo_blue,
                                                    },
                                                }}
                                            />
                                        }
                                        label="Enable Section"
                                        sx={{ color: 'white' }}
                                    />
                                </Box>
                                <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />

                                <Grid container spacing={{ xs: 2, md: 3 }}>
                                    <Grid item xs={12} md={6}>
                                        <CustomTextField
                                            label="Hero Title"
                                            value={impactReportForm.hero.title}
                                            onChange={(e) =>
                                                handleSectionChange('hero', 'title', e.target.value)
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <CustomTextField
                                            label="Hero Subtitle"
                                            value={impactReportForm.hero.subtitle}
                                            onChange={(e) =>
                                                handleSectionChange('hero', 'subtitle', e.target.value)
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Background Image
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleImageUpload('hero', 'backgroundImage', e)
                                                }
                                                style={{ display: 'none' }}
                                                ref={(el) => (fileInputRefs.current['hero-bg'] = el)}
                                            />
                                            <Button
                                                variant="outlined"
                                                startIcon={<CloudUploadIcon />}
                                                onClick={() =>
                                                    fileInputRefs.current['hero-bg']?.click()
                                                }
                                                sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                                            >
                                                Upload Background
                                            </Button>
                                            {impactReportForm.hero.backgroundImagePreview && (
                                                <Box
                                                    sx={{
                                                        width: { xs: '100%', sm: 100 },
                                                        height: { xs: 120, sm: 60 },
                                                        overflow: 'hidden',
                                                        borderRadius: 1,
                                                        minWidth: { xs: 'auto', sm: 100 },
                                                    }}
                                                >
                                                    <img
                                                        src={impactReportForm.hero.backgroundImagePreview}
                                                        alt="Background preview"
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Mission Section */}
                        {currentTab === 1 && (
                            <Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
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
                                                        'mission',
                                                        'enabled',
                                                        e.target.checked,
                                                    )
                                                }
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: COLORS.gogo_blue,
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                                    {
                                                        backgroundColor: COLORS.gogo_blue,
                                                    },
                                                }}
                                            />
                                        }
                                        label="Enable Section"
                                        sx={{ color: 'white' }}
                                    />
                                </Box>
                                <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            label="Section Title"
                                            value={impactReportForm.mission.title}
                                            onChange={(e) =>
                                                handleSectionChange('mission', 'title', e.target.value)
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
                                                    'mission',
                                                    'content',
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
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleImageUpload('mission', 'image', e)
                                                }
                                                style={{ display: 'none' }}
                                                ref={(el) =>
                                                    (fileInputRefs.current['mission-img'] = el)
                                                }
                                            />
                                            <Button
                                                variant="outlined"
                                                startIcon={<CloudUploadIcon />}
                                                onClick={() =>
                                                    fileInputRefs.current['mission-img']?.click()
                                                }
                                            >
                                                Upload Image
                                            </Button>
                                            {impactReportForm.mission.imagePreview && (
                                                <Box
                                                    sx={{
                                                        width: 100,
                                                        height: 60,
                                                        overflow: 'hidden',
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <img
                                                        src={impactReportForm.mission.imagePreview}
                                                        alt="Mission preview"
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
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
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
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
                                                        'impact',
                                                        'enabled',
                                                        e.target.checked,
                                                    )
                                                }
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: COLORS.gogo_blue,
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                                    {
                                                        backgroundColor: COLORS.gogo_blue,
                                                    },
                                                }}
                                            />
                                        }
                                        label="Enable Section"
                                        sx={{ color: 'white' }}
                                    />
                                </Box>
                                <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            label="Section Title"
                                            value={impactReportForm.impact.title}
                                            onChange={(e) =>
                                                handleSectionChange('impact', 'title', e.target.value)
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
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
                                                sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)' }}
                                            >
                                                <CardContent>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mb: 2,
                                                        }}
                                                    >
                                                        <Typography variant="h6">
                                                            Statistic {index + 1}
                                                        </Typography>
                                                        <IconButton
                                                            onClick={() => handleRemoveStat(index)}
                                                            sx={{ color: 'rgba(255,255,255,0.7)' }}
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
                                                                        'number',
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
                                                                        'label',
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
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
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
                                                        'programs',
                                                        'enabled',
                                                        e.target.checked,
                                                    )
                                                }
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: COLORS.gogo_blue,
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                                    {
                                                        backgroundColor: COLORS.gogo_blue,
                                                    },
                                                }}
                                            />
                                        }
                                        label="Enable Section"
                                        sx={{ color: 'white' }}
                                    />
                                </Box>
                                <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            label="Section Title"
                                            value={impactReportForm.programs.title}
                                            onChange={(e) =>
                                                handleSectionChange('programs', 'title', e.target.value)
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
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
                                                    sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)' }}
                                                >
                                                    <CardContent>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                mb: 2,
                                                            }}
                                                        >
                                                            <Typography variant="h6">
                                                                Program {index + 1}
                                                            </Typography>
                                                            <IconButton
                                                                onClick={() => handleRemoveProgram(index)}
                                                                sx={{ color: 'rgba(255,255,255,0.7)' }}
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
                                                                            'name',
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
                                                                            'description',
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
                                                                        display: 'flex',
                                                                        alignItems: 'center',
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
                                                                                        'image',
                                                                                        file,
                                                                                    );
                                                                                    handleProgramChange(
                                                                                        index,
                                                                                        'imagePreview',
                                                                                        readerEvent.target
                                                                                            ?.result as string,
                                                                                    );
                                                                                };
                                                                                reader.readAsDataURL(file);
                                                                            }
                                                                        }}
                                                                        style={{ display: 'none' }}
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
                                                                                overflow: 'hidden',
                                                                                borderRadius: 1,
                                                                            }}
                                                                        >
                                                                            <img
                                                                                src={program.imagePreview}
                                                                                alt="Program preview"
                                                                                style={{
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    objectFit: 'cover',
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
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
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
                                                        'locations',
                                                        'enabled',
                                                        e.target.checked,
                                                    )
                                                }
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: COLORS.gogo_blue,
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                                    {
                                                        backgroundColor: COLORS.gogo_blue,
                                                    },
                                                }}
                                            />
                                        }
                                        label="Enable Section"
                                        sx={{ color: 'white' }}
                                    />
                                </Box>
                                <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            label="Section Title"
                                            value={impactReportForm.locations.title}
                                            onChange={(e) =>
                                                handleSectionChange(
                                                    'locations',
                                                    'title',
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
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
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
                                                        'testimonials',
                                                        'enabled',
                                                        e.target.checked,
                                                    )
                                                }
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: COLORS.gogo_blue,
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                                    {
                                                        backgroundColor: COLORS.gogo_blue,
                                                    },
                                                }}
                                            />
                                        }
                                        label="Enable Section"
                                        sx={{ color: 'white' }}
                                    />
                                </Box>
                                <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            label="Section Title"
                                            value={impactReportForm.testimonials.title}
                                            onChange={(e) =>
                                                handleSectionChange(
                                                    'testimonials',
                                                    'title',
                                                    e.target.value,
                                                )
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
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
                                                    sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)' }}
                                                >
                                                    <CardContent>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                mb: 2,
                                                            }}
                                                        >
                                                            <Typography variant="h6">
                                                                Testimonial {index + 1}
                                                            </Typography>
                                                            <IconButton
                                                                onClick={() => handleRemoveTestimonial(index)}
                                                                sx={{ color: 'rgba(255,255,255,0.7)' }}
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
                                                                            'name',
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
                                                                            'role',
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
                                                                        display: 'flex',
                                                                        alignItems: 'center',
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
                                                                                        'image',
                                                                                        file,
                                                                                    );
                                                                                    handleTestimonialChange(
                                                                                        index,
                                                                                        'imagePreview',
                                                                                        readerEvent.target
                                                                                            ?.result as string,
                                                                                    );
                                                                                };
                                                                                reader.readAsDataURL(file);
                                                                            }
                                                                        }}
                                                                        style={{ display: 'none' }}
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
                                                                                overflow: 'hidden',
                                                                                borderRadius: '50%',
                                                                            }}
                                                                        >
                                                                            <img
                                                                                src={testimonial.imagePreview}
                                                                                alt="Testimonial preview"
                                                                                style={{
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    objectFit: 'cover',
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
                                                                            'content',
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

