import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

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

  const handleAnswerClick = (questionId, answer) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId && q.selectedAnswer === null
          ? { ...q, selectedAnswer: answer }
          : q
      )
    );
  };

  const getButtonColor = (question, answer) => {
    if (question.selectedAnswer === null) {
      return "primary";
    }

    if (answer === question.correctAnswer) {
      return "success";
    }

    if (answer === question.selectedAnswer && answer !== question.correctAnswer) {
      return "error";
    }

    return "primary";
  };

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

      {!loading && !error && (
        <Stack spacing={3}>
          {questions.map((q, index) => (
            <Card key={q.id} elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {index + 1}. {q.question}
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  {q.answers.map((answer, answerIndex) => (
                    <Button
                      key={answerIndex}
                      variant="contained"
                      color={getButtonColor(q, answer)}
                      onClick={() => handleAnswerClick(q.id, answer)}
                      disabled={q.selectedAnswer !== null}
                    >
                      {answer}
                    </Button>
                  ))}
                </Stack>

                {q.selectedAnswer !== null && (
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>
                    {q.selectedAnswer === q.correctAnswer
                      ? "Correct!"
                      : `Wrong! Correct answer: ${q.correctAnswer}`}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

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