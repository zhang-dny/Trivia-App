import { Box, Button, Container, Typography } from "@mui/material";

function App() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Trivia Game
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Button variant="contained">
          Generate New Questions
        </Button>
      </Box>

      <Typography align="center">
        Trivia questions will appear here.
      </Typography>
    </Container>
  );
}

export default App;