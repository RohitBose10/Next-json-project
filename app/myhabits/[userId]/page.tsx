"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { styled } from "@mui/system"; // Ensure this line is included

import {
  Container,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const HeroSection = styled("div")({
  background: "linear-gradient(135deg, #6A0DAD, #FF1493)",
  color: "white",
  textAlign: "center",
  padding: "4rem 2rem",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  fontFamily: "'Roboto', sans-serif",
});

const CenteredButton = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  marginTop: "2rem",
  marginBottom: "1rem",
}));

const MyHabits = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    frequency: "",
    timing: "",
    period: "AM",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const API_URL = "http://localhost:1000/userHabits";
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Habit Name is required.";
    if (!formData.description.trim())
      errors.description = "Description is required.";
    if (!formData.frequency.trim()) errors.frequency = "Frequency is required.";
    if (!formData.timing.trim() || isNaN(Number(formData.timing)))
      errors.timing = "Valid timing is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { data: habits = [] } = useQuery({
    queryKey: ["userHabits", userId],
    queryFn: async () => {
      const response = await axios.get(API_URL);
      return response.data.filter((habit) => habit.userId === userId);
    },
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: async (newHabit) => {
      const timingWithPeriod = `${newHabit.timing} ${newHabit.period}`;
      const dataToSend = { ...newHabit, timing: timingWithPeriod, userId };

      if (isEditing) {
        await axios.put(`${API_URL}/${newHabit.id}`, dataToSend);
        toast.success("Habit updated successfully!");
      } else {
        await axios.post(API_URL, {
          ...dataToSend,
          id: Date.now().toString(),
        });
        toast.success("Habit added successfully!");
      }
    },
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries(["userHabits", userId]);
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to save habit. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userHabits", userId]);
      toast.success("Habit deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete habit. Please try again.");
    },
  });

  const handleEdit = (habit) => {
    const [timing, period] = habit.timing.split(" ");
    setFormData({ ...habit, timing, period });
    setIsEditing(true);
    setModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      frequency: "",
      timing: "",
      period: "AM",
    });
    setFormErrors({});
    setIsEditing(false);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  return (
    <Container maxWidth="lg" className="py-10">
      {/* Hero Section */}
      <HeroSection>
        <Typography variant="h3" gutterBottom style={{ fontWeight: 600 }}>
          Empower Your Daily Routine
        </Typography>
        <Typography variant="h6" style={{ fontWeight: 400 }}>
          Organize your habits, stay consistent, and unlock your potential with
          ease.
        </Typography>
      </HeroSection>

      {/* Add Habit Button */}
      <CenteredButton>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          Add Habit
        </Button>
      </CenteredButton>

      {/* Habits Table */}
      <section>
        <Typography variant="h5" color="#A445B2" fontWeight="bold" gutterBottom>
          Your Habits
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Habit Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Timing</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {habits.map((habit) => (
                <TableRow key={habit.id}>
                  <TableCell>{habit.name}</TableCell>
                  <TableCell>{habit.description}</TableCell>
                  <TableCell>{habit.frequency}</TableCell>
                  <TableCell>{habit.timing}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      color="primary"
                      onClick={() => handleEdit(habit)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      color="secondary"
                      onClick={() => deleteMutation.mutate(habit.id)}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      {/* Modal for Add/Edit Habit */}
      <Dialog open={isModalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>
          {isEditing ? "Edit Habit" : "Add a New Habit"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Habit Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                fullWidth
                margin="normal"
                required
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                fullWidth
                multiline
                rows={3}
                margin="normal"
                required
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Frequency"
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                fullWidth
                margin="normal"
                required
                error={!!formErrors.frequency}
                helperText={formErrors.frequency}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Timing"
                type="number"
                value={formData.timing}
                onChange={(e) =>
                  setFormData({ ...formData, timing: e.target.value })
                }
                fullWidth
                margin="normal"
                required
                error={!!formErrors.timing}
                helperText={formErrors.timing}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Period</InputLabel>
                <Select
                  value={formData.period}
                  onChange={(e) =>
                    setFormData({ ...formData, period: e.target.value })
                  }
                >
                  <MenuItem value="AM">AM</MenuItem>
                  <MenuItem value="PM">PM</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {isEditing ? "Update Habit" : "Add Habit"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              resetForm();
              setModalOpen(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Motivational Section */}
      <HeroSection className="mt-12">
        <Typography
          variant="h4"
          gutterBottom
          style={{ fontWeight: 600, fontFamily: "'Roboto', sans-serif" }}
        >
          Stay Consistent!
        </Typography>
        <Typography
          variant="body1"
          style={{ fontWeight: 300, fontFamily: "'Roboto', sans-serif'" }}
        >
          Adding new habits helps you set meaningful goals, while updating them
          keeps your routines fresh and aligned with your growth. Each step
          forward is an investment in the best version of yourself.
        </Typography>
      </HeroSection>

      <ToastContainer />
    </Container>
  );
};

export default MyHabits;
