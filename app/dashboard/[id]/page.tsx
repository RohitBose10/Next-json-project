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

/*************  ✨ Codeium Command 🌟  *************/
interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: string;
  timing: string;
  period: string;
}
/******  b32cdc6b-0884-4871-8bf7-f31ef0c4f6b5  *******/

const HeroSection = styled("div")({
  background: "linear-gradient(135deg, #6A0DAD, #FF1493)",
  color: "white",
  textAlign: "center",
  padding: "4rem 2rem !important",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  fontFamily: "'Roboto', sans-serif",
});

const StyledCard = styled(Card)(() => ({
  borderRadius: "16px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledTypography = styled(Typography)(() => ({
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 400,
}));

export default function DashboardPage() {
  const { id } = useParams();
  
  const [completedToday, setCompletedToday] = useState<string[]>([]);

  const {
    data: userHabits = [],
    isLoading,
    isError,
  } = useQuery<Habit[]>({
    queryKey: ["userHabits", id],
    queryFn: async () => {
      const response = await axios.get("http://localhost:1000/userHabits");
      
      return response.data.filter((habit: Habit) => habit.userId === id);
     
    },
    enabled: !!id,
    
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
      <HeroSection>
        <Typography variant="h3" gutterBottom style={{ fontWeight: 600 }}>
          Welcome to Your Habit Dashboard
        </Typography>
        <Typography variant="h6" style={{ fontWeight: 300 }}>
          Track your progress, stay consistent, and achieve your goals!
        </Typography>
      </HeroSection>

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

      <section className="mt-10">
        <StyledTypography
          variant="h4"
          gutterBottom
          style={{ fontWeight: 600, color: "#A445B2" }}
        >
          Your Habits
        </StyledTypography>
        {userHabits.length > 0 ? (
          <Grid container spacing={4}>
            {userHabits.map((habit: Habit) => (
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
                    <Typography variant="body2" color="textSecondary">
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
                          ? "success"
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
          <Typography variant="body2" color="textSecondary">
            No habits found. Start by adding your first habit!
          </Typography>
        )}
      </section>
    </Container>
  );
}
