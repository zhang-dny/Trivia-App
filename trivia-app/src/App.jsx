import { Box, Button, Container, Typography } from "@mui/material";

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
        Questions loaded: {questions.length}
      </Typography>

      {loading && (
        <Typography align="center" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      )}

      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Container>
  );
}

export default App;