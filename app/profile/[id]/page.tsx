"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Avatar,
  Typography,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Drawer,
  Box,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled Components
const HeroSection = styled("div")({
  background: "linear-gradient(135deg, #6A0DAD, #FF1493)",
  color: "white",
  textAlign: "center",
  padding: "4rem 2rem",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  position: "relative",
});

const StyledHeading = styled(Typography)({
  fontWeight: "bold",
  fontSize: "2.5rem",
  color: "#FFFFFF",
});

const SectionTitle = styled(Typography)({
  fontWeight: "bold",
  fontSize: "1.75rem",
  color: "#1F2937",
  marginBottom: "16px",
});

const LabelText = styled(Typography)({
  fontWeight: "600",
  fontSize: "1rem",
  color: "#374151",
});

const ValueText = styled(Typography)({
  fontSize: "1rem",
  color: "#4B5563",
});

// User Interface
interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  profilePicture: string;
}

// Fetch user data
const fetchUserData = async (id: string): Promise<User> => {
  const response = await axios.get("http://localhost:1000/users");
  const user = response.data.find((user: User) => user.id === id);
  if (!user) throw new Error("User not found");
  return user;
};

// Update user data
const updateUser = async (updatedUser: User): Promise<void> => {
  await axios.put(`http://localhost:1000/users/${updatedUser.id}`, updatedUser);
};

export default function ProfilePage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserData(typeof id === "string" ? id : ""),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      toast.success("Profile updated successfully!");
    },
  });

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: "",
    name: "",
    email: "",
    mobileNumber: "",
    profilePicture: "",
  });

  const handleEditClick = () => {
    if (userData) {
      setFormData(userData);
      setDrawerOpen(true);
    }
  };

  const handleSaveChanges = () => {
    if (formData.id) {
      mutation.mutate(formData);
      setDrawerOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center mt-10">
        {(error as Error).message}
      </p>
    );
  }

  if (!userData) {
    return <p className="text-red-500 text-center mt-10">User not found.</p>;
  }

  return (
    <Container maxWidth="lg" className="py-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <HeroSection>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            alt={userData.name}
            src={userData.profilePicture}
            sx={{
              width: 150,
              height: 150,
              margin: "0 auto 1rem",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          />
          <IconButton
            sx={{
              position: "absolute",
              bottom: 5,
              right: 5,
              background: "#FFF",
              border: "2px solid #6A0DAD",
              zIndex: 1000,
            }}
            onClick={handleEditClick}
          >
            <EditIcon color="primary" />
          </IconButton>
        </Box>
        <StyledHeading>Welcome, {userData.name}!</StyledHeading>
      </HeroSection>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #6A0DAD, #FF1493)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <SectionTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.8rem",
            textAlign: "center",
            color: "white", // Changed to white
            textShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)", // Stronger contrast
          }}
        >
          User Information
        </SectionTitle>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} display="flex" alignItems="center">
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                width: 30,
                height: 30,
                mr: 2,
              }}
            >
              🧑
            </Avatar>
            <Box>
              <LabelText sx={{ color: "white" }}>Name</LabelText>
              <ValueText sx={{ color: "white" }}>{userData.name}</ValueText>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} display="flex" alignItems="center">
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                width: 30,
                height: 30,
                mr: 2,
              }}
            >
              📧
            </Avatar>
            <Box>
              <LabelText sx={{ color: "white" }}>Email</LabelText>
              <ValueText sx={{ color: "white" }}>{userData.email}</ValueText>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} display="flex" alignItems="center">
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                width: 30,
                height: 30,
                mr: 2,
              }}
            >
              📞
            </Avatar>
            <Box>
              <LabelText sx={{ color: "white" }}>Mobile Number</LabelText>
              <ValueText sx={{ color: "white" }}>
                {userData.mobileNumber}
              </ValueText>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "35%",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px 0 0 16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            padding: "24px",
          },
        }}
      >
        <Box sx={{ width: "100%", textAlign: "center", p: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "white", // Changed to white
              textShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)", // Stronger contrast
            }}
          >
            Edit Profile
          </Typography>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              alt={formData.name}
              src={formData.profilePicture}
              sx={{
                width: 130,
                height: 130,
                margin: "0 auto",
                cursor: "pointer",
                border: "4px solid white",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
              onClick={() => document.getElementById("upload-image")?.click()}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 10,
                right: 10,
                background: "#FFF",
                borderRadius: "50%",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
                p: 1,
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("upload-image")?.click()}
            >
              <EditIcon color="primary" />
            </Box>
          </Box>
          <input
            id="upload-image"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                  if (reader.result) {
                    setFormData({
                      ...formData,
                      profilePicture: reader.result as string,
                    });
                  }
                };
                reader.readAsDataURL(file);
              } else {
                toast.error("Please upload a valid image file.");
              }
            }}
          />
          <Box sx={{ mt: 3 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              margin="normal"
              sx={{
                "& .MuiInputLabel-root": {
                  color: "white", // Labels changed to white
                },
                "& .MuiInputBase-root": {
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(5px)",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                },
              }}
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              fullWidth
              margin="normal"
              sx={{
                "& .MuiInputLabel-root": {
                  color: "white", // Labels changed to white
                },
                "& .MuiInputBase-root": {
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(5px)",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                },
              }}
            />
            <TextField
              label="Mobile Number"
              value={formData.mobileNumber}
              onChange={(e) =>
                setFormData({ ...formData, mobileNumber: e.target.value })
              }
              fullWidth
              margin="normal"
              sx={{
                "& .MuiInputLabel-root": {
                  color: "white", // Labels changed to white
                },
                "& .MuiInputBase-root": {
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(5px)",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6A0DAD, #FF1493)",
                boxShadow: "0px 4px 15px rgba(255, 20, 147, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5A0DA0, #E01080)",
                },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Container>
  );
}
