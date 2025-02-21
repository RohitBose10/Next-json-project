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
import { useRouter } from "next/navigation";

const HeroSection = styled("div")({
  background: "linear-gradient(135deg, #6A0DAD, #FF1493)",
  color: "white",
  textAlign: "center",
  padding: "4rem 2rem",
  borderRadius: "16px",
  fontFamily: "'Roboto', sans-serif",
});

const FeatureCard = styled(Card)({
  backgroundColor: "#fff",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
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
  color: "#000",
});

export default function Homepage() {
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const handleSignUpRedirect = () => {
    router.push("/registration");
  };

  return (
    <Container maxWidth="lg" className="py-10">
      <HeroSection>
        <Typography variant="h2" gutterBottom style={{ fontWeight: 600 }}>
          Track Your Habits, Transform Your Life
        </Typography>
        <Typography variant="h6" gutterBottom style={{ fontWeight: 300 }}>
          Build healthy habits, stay consistent, and achieve your goals with
          ease.
        </Typography>
        <div className="mt-6">
          {!userId && (
            <Button
              variant="contained"
              style={{
                background: "linear-gradient(135deg, #A445B2, #D41872)",
                fontWeight: 500,
              }}
              size="large"
              onClick={handleSignUpRedirect}
            >
              Get Started
            </Button>
          )}
        </div>
      </HeroSection>

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
        {!userId && (
          <Button
            variant="contained"
            style={{
              background: "linear-gradient(135deg, #A445B2, #D41872)",
              fontWeight: 500,
            }}
            size="large"
            onClick={handleSignUpRedirect}
          >
            Sign Up Now
          </Button>
        )}
      </section>
    </Container>
  );
}
