import React, { useState, useEffect} from 'react';
import './css/Goals.css';

const Goals: React.FC = () => {
  const questions = [
    "“Have you been feeling overwhelmed, stressed, or anxious about something in particular?”",
    "“Have you noticed any changes in your routine or behavior, like sleep, appetite, or energy levels?”",
    "“Have there been any recent events or changes in your life that have been difficult to deal with?”",
    "“Have you been having any thoughts that have been hard to shake or that keep coming back?”",
    "“Have you been feeling disconnected from others, or do you feel lonely?”",
    "“Do you feel physically exhausted, even if you’re not doing much?”",
    "“Are there any ways you’ve been dealing with stress that you feel aren’t helping or might be making things worse?”",
    "“How do you feel about the future? Do things seem manageable or overwhelming?”",
    // Optional follow-up questions
    "“Can you tell me more about that?”",
    "“How long have you been feeling this way?”",
    "“What do you think would make things easier or help you feel better?”",
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responseText, setResponseText] = useState('');

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert(
        'Thank you for sharing. Remember, you can take a break or stop whenever you need.'
      );
      setCurrentQuestionIndex(0);
    }
  };

  const moveToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitResponse = () => {
    alert(`Response submitted: ${responseText}`);

    fetch("/api/insert", {
        method: 'POST', 
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ user_input: responseText, prompt: questions[currentQuestionIndex] }), 
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(err => console.log(err.message));

    setResponseText(''); 
};

  return (
    <div className="goals-main-container">
      <div className="goals-container">
        <header>
          <h1>Reflection Questions</h1>
        </header>

        <div className="goals-question-container">
          <p className="goals-question">{questions[currentQuestionIndex]}</p>
          <div className="goals-response">
            <textarea
              className="goals-textbox"
              rows={4}
              placeholder="Type your response here..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            ></textarea>
            <div className="goals-buttons">
              <button
                className="goals-button"
                onClick={moveToPrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous Question
              </button>
              <button className="goals-button" onClick={moveToNextQuestion}>
                Next Question
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="goals-submit-button-container">
        <button className="goals-button" onClick={submitResponse}>
          Submit Response
        </button>
      </div>
    </div>
  );
};

export default Goals;
