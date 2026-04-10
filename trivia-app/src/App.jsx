import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
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
        const allAnswers = shuffleArray([
          ...q.incorrectAnswers,
          q.correctAnswer,
        ]);

        return {
          id: index,
          question: q.question.text,
          correctAnswer: q.correctAnswer,
          answers: allAnswers,
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

  const getScore = () => {
    return questions.filter(
      (q) => q.selectedAnswer === q.correctAnswer
    ).length;
  };

  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => q.selectedAnswer !== null);

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

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <Stack spacing={3}>
          {questions.map((question, index) => (
            <Card key={question.id} elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {index + 1}. {question.question}
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  {question.answers.map((answer, answerIndex) => (
                    <Button
                      key={answerIndex}
                      variant="contained"
                      color={getButtonColor(question, answer)}
                      onClick={() => handleAnswerClick(question.id, answer)}
                      disabled={question.selectedAnswer !== null}
                    >
                      {answer}
                    </Button>
                  ))}
                </Stack>

                {question.selectedAnswer !== null && (
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>
                    {question.selectedAnswer === question.correctAnswer
                      ? "Correct!"
                      : `Wrong! Correct answer: ${question.correctAnswer}`}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}

          {allAnswered && (
            <Typography variant="h5" align="center" sx={{ mt: 2 }}>
              Score: {getScore()} / {questions.length}
            </Typography>
          )}
        </Stack>
      )}
    </Container>
  );
}

export default App;