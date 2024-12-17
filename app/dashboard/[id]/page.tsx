"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeroSection = styled("div")(({ theme }) => ({
  background: "linear-gradient(135deg, #6A0DAD, #FF1493)",
  color: "white",
  textAlign: "center",
  padding: "4rem 2rem !important",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  fontFamily: "'Roboto', sans-serif",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: theme.shadows[3],
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 400,
}));

export default function DashboardPage() {
  const { id } = useParams(); // Extract user ID from route
  const [completedToday, setCompletedToday] = useState<string[]>([]); // Track completed habits

  // Fetch user habits with React Query
  const {
    data: userHabits = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userHabits", id],
    queryFn: async () => {
      const response = await axios.get("http://localhost:1000/userHabits");
      return response.data.filter((habit: any) => habit.userId === id);
    },
    enabled: !!id, // Only run query if `id` is available
  });

  const handleMarkDone = (habitId: string) => {
    if (!completedToday.includes(habitId)) {
      setCompletedToday((prev) => [...prev, habitId]);
      toast.success("Habit marked as done! 🎉", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <StyledTypography color="error">
          Failed to load habits. Please try again.
        </StyledTypography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-10">
      <ToastContainer />
      {/* Hero Section */}
      <HeroSection>
        <Typography
          variant="h3"
          gutterBottom
          style={{ fontWeight: 600, fontFamily: "'Roboto', sans-serif" }}
        >
          Welcome to Your Habit Dashboard
        </Typography>
        <Typography
          variant="h6"
          style={{ fontWeight: 300, fontFamily: "'Roboto', sans-serif" }}
        >
          Track your progress, stay consistent, and achieve your goals!
        </Typography>
      </HeroSection>

      {/* Overview Section */}
      <Grid container spacing={4} className="mt-6">
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <StyledTypography variant="h5" gutterBottom>
                Total Habits
              </StyledTypography>
              <Typography
                variant="h3"
                color="primary"
                style={{ fontWeight: 600 }}
              >
                {userHabits.length}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <StyledTypography variant="h5" gutterBottom>
                Habits Completed Today
              </StyledTypography>
              <Typography
                variant="h3"
                color="error"
                style={{ fontWeight: 600 }}
              >
                {completedToday.length}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <StyledTypography variant="h5" gutterBottom>
                Pending Habits
              </StyledTypography>
              <Typography
                variant="h3"
                color="secondary"
                style={{ fontWeight: 600 }}
              >
                {userHabits.length - completedToday.length}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Habits Section */}
      <section className="mt-10">
        <StyledTypography
          variant="h4"
          gutterBottom
          style={{
            fontWeight: 600,
            fontFamily: "'Roboto', sans-serif",
            color: "#A445B2",
          }}
        >
          Your Habits
        </StyledTypography>
        {userHabits.length > 0 ? (
          <Grid container spacing={4}>
            {userHabits.map((habit: any) => (
              <Grid item xs={12} md={6} lg={4} key={habit.id}>
                <StyledCard>
                  <CardContent>
                    <Typography
                      variant="h6"
                      color="primary"
                      style={{ fontWeight: 500 }}
                    >
                      {habit.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {habit.description}
                    </Typography>
                    <Box mt={2}>
                      <Typography variant="body2">
                        <strong>Frequency:</strong> {habit.frequency}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Timing:</strong> {habit.timing}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color={
                        completedToday.includes(habit.id)
                          ? "default"
                          : "primary"
                      }
                      sx={{ mb: 1 }}
                      onClick={() => handleMarkDone(habit.id)}
                      disabled={completedToday.includes(habit.id)}
                      style={{ fontWeight: 500 }}
                    >
                      {completedToday.includes(habit.id)
                        ? "Done"
                        : "Mark as Done"}
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            No habits found. Start by adding your first habit!
          </Typography>
        )}
      </section>

      {/* Motivational Section */}
      <HeroSection className="mt-12">
        <Typography
          variant="h4"
          gutterBottom
          style={{ fontWeight: 600, fontFamily: "'Roboto', sans-serif" }}
        >
          Keep Going!
        </Typography>
        <Typography
          variant="body1"
          style={{ fontWeight: 300, fontFamily: "'Roboto', sans-serif" }}
        >
          Remember, small daily habits can lead to big changes over time. Stay
          consistent and celebrate your progress!
        </Typography>
      </HeroSection>
    </Container>
  );
}
