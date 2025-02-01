"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/system";
import SignupModal from "./auth/registration/page";

const HeroSection = styled("div")({
  background: "linear-gradient(135deg, #6A0DAD, #FF1493)",
  color: "white",
  textAlign: "center",
  padding: "4rem 2rem",
  borderRadius: "16px",
  fontFamily: "'Roboto', sans-serif",
});

const FeatureCard = styled(Card)({
  background: "#fff", // Assuming you want a white background, remove if unnecessary
  boxShadow: 4,
  borderRadius: "16px",
  transition: "transform 0.3s ease",
  fontFamily: "'Roboto', sans-serif",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const StyledTypography = styled(Typography)({
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 400,
  color: "#000", // Default text color
});

export default function Homepage() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [userId, setUserId] = useState(null); // State to track if user is logged in

  useEffect(() => {
    // Get userId from localStorage on page load
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const handleOpenModal = () => setIsModalOpen(true); // Open modal
  const handleCloseModal = () => setIsModalOpen(false); // Close modal

  return (
    <Container maxWidth="lg" className="py-10">
      {/* Hero Section */}
      <HeroSection>
        <Typography variant="h2" gutterBottom style={{ fontWeight: 600 }}>
          Track Your Habits, Transform Your Life
        </Typography>
        <Typography variant="h6" gutterBottom style={{ fontWeight: 300 }}>
          Build healthy habits, stay consistent, and achieve your goals with
          ease.
        </Typography>
        <div className="mt-6">
          {/* Only show the button if user is not logged in */}
          {!userId && (
            <Button
              variant="contained"
              style={{
                background: "linear-gradient(135deg, #A445B2, #D41872)",
                fontWeight: 500,
              }}
              size="large"
              onClick={handleOpenModal} // Open modal on click
            >
              Get Started
            </Button>
          )}
        </div>
      </HeroSection>

      {/* Features Section */}
      <section className="my-16">
        <StyledTypography
          variant="h4"
          align="center"
          style={{ fontWeight: 600, color: "#A445B2" }}
          gutterBottom
        >
          Why Choose Our Habit Tracker?
        </StyledTypography>
        <Grid container spacing={4} className="mt-6">
          {/* Feature Cards */}
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardContent>
                <StyledTypography
                  variant="h5"
                  gutterBottom
                  style={{ fontWeight: 500, color: "#D41872" }}
                >
                  Intuitive Dashboard
                </StyledTypography>
                <Typography variant="body1">
                  Get a quick overview of your progress and stay on top of your
                  goals.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardContent>
                <StyledTypography
                  variant="h5"
                  gutterBottom
                  style={{ fontWeight: 500, color: "#D41872" }}
                >
                  Flexible Habit Management
                </StyledTypography>
                <Typography variant="body1">
                  Add, edit, and organize your habits effortlessly.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardContent>
                <StyledTypography
                  variant="h5"
                  gutterBottom
                  style={{ fontWeight: 500, color: "#D41872" }}
                >
                  Stay Motivated
                </StyledTypography>
                <Typography variant="body1">
                  Visualize your progress and celebrate milestones along the
                  way.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>
      </section>

      {/* Call to Action Section */}
      <section
        className="text-center py-12"
        style={{
          background: "linear-gradient(135deg, #6A0DAD, #FF1493)",
          borderRadius: "20px",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        <Typography variant="h4" gutterBottom style={{ fontWeight: 600 }}>
          {userId
            ? "Thanks for Joining Thousands of Habit Trackers Like You!"
            : "Ready to Take Control of Your Habits?"}
        </Typography>
        <Typography
          variant="body1"
          className="mb-6"
          style={{ fontWeight: 300 }}
        >
          {userId
            ? "We’re thrilled to have you on board! Keep tracking and achieving your goals with ease."
            : "Join thousands of users transforming their lives with our Habit Tracker."}
        </Typography>
        {/* Only show the button if user is not logged in */}
        {!userId && (
          <Button
            variant="contained"
            style={{
              background: "linear-gradient(135deg, #A445B2, #D41872)",
              fontWeight: 500,
            }}
            size="large"
            onClick={handleOpenModal} // Open modal on click
          >
            Sign Up Now
          </Button>
        )}
      </section>

      {/* Signup Modal */}
      <SignupModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </Container>
  );
}
