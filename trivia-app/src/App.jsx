import { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shuffleArray = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://the-trivia-api.com/v2/questions?limit=5"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions.");
      }

      const data = await response.json();

      const formattedQuestions = data.map((q, index) => {
        return {
          id: index,
          question: q.question.text,
          correctAnswer: q.correctAnswer,
          answers: shuffleArray([...q.incorrectAnswers, q.correctAnswer]),
          selectedAnswer: null,
        };
      });

      setQuestions(formattedQuestions);
    } catch (err) {
      setError("Could not load trivia questions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Trivia Game
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Button variant="contained" onClick={loadQuestions}>
          Generate New Questions
        </Button>
      </Box>

      {!loading &&
        !error &&
        questions.map((q) => (
          <Box key={q.id} sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1 }}>{q.question}</Typography>
            {q.answers.map((answer, index) => (
              <Typography key={index} sx={{ ml: 2 }}>
                • {answer}
              </Typography>
            ))}
          </Box>
        ))}

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