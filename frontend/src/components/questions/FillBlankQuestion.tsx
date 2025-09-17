'use client';

import { useState, useEffect } from 'react';
import { FillBlankQuestion } from '@/_interfaces/questions/questions';
import { useCheckAnswer } from '@/_queries/questions/questions';
import { useSound } from '@/hooks/useSound';

interface FillBlankQuestionProps {
    question: FillBlankQuestion;
    onCorrectAnswer: () => void;
    onContinue: () => void;
}

export default function FillBlankQuestionComponent({ 
    question, 
    onCorrectAnswer, 
    onContinue 
}: FillBlankQuestionProps) {
    const [userAnswer, setUserAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [correctionReason, setCorrectionReason] = useState('');
    const { playSound } = useSound();

    // Use the React Query mutation hook
    const checkAnswerMutation = useCheckAnswer();

    // Reset state when question changes
    useEffect(() => {
        setUserAnswer('');
        setShowResult(false);
        setIsCorrect(false);
        setCorrectionReason('');
        checkAnswerMutation.reset(); // Reset mutation state
    }, [question?.id, question?.question]); // eslint-disable-line react-hooks/exhaustive-deps

    // Debug logging and safety check (commented out to prevent constant logging)
    // console.log('FillBlankQuestion received:', question);
    
    // Safety check for question data
    if (!question || !question.question || !question.answer) {
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                <div className="text-center text-red-300">
                    Error: Invalid question data structure
                    <pre className="mt-2 text-xs text-gray-400">
                        {JSON.stringify(question, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }

    const handleSubmit = () => {
        if (!userAnswer.trim() || showResult || checkAnswerMutation.isPending) return;

        checkAnswerMutation.mutate({
            user_answer: userAnswer.trim(),
            correct_answer: question.answer,
            question_text: question.question,
            validation_type: question.validation
        }, {
            onSuccess: (result) => {
                setIsCorrect(result.is_correct);
                setCorrectionReason(result.reason || '');
                setShowResult(true);
                
                // Play sound for correct or incorrect answer
                playSound(result.is_correct ? 'correct' : 'incorrect');
                
                // Auto-continue after answer
                if (result.is_correct) {
                    setTimeout(() => {
                        onCorrectAnswer();
                    }, 1500);
                } else {
                    setTimeout(() => {
                        onContinue();
                    }, 2500); // Give more time to read the feedback
                }
            },
            onError: (error) => {
                console.error('OpenAI correction failed, falling back to direct comparison:', error);
                
                // Fallback to direct comparison based on validation type
                let correct = false;
                switch (question.validation) {
                    case 'exact':
                        correct = userAnswer.trim() === question.answer;
                        break;
                    case 'case_insensitive':
                        correct = userAnswer.trim().toLowerCase() === question.answer.toLowerCase();
                        break;
                    case 'contains':
                        correct = question.answer.toLowerCase().includes(userAnswer.trim().toLowerCase());
                        break;
                    default:
                        correct = userAnswer.trim() === question.answer;
                }
                
                setIsCorrect(correct);
                setCorrectionReason(correct ? 'Correct answer!' : 'Answer does not match expected response.');
                setShowResult(true);
                
                // Play sound for correct or incorrect answer
                playSound(correct ? 'correct' : 'incorrect');
                
                // Auto-continue after answer
                if (correct) {
                    setTimeout(() => {
                        onCorrectAnswer();
                    }, 1500);
                } else {
                    setTimeout(() => {
                        onContinue();
                    }, 2500); // Give more time to read the feedback
                }
            }
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleContinue = () => {
        onContinue();
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-6">
            {/* Question Header */}
            <div className="text-center">
                <div className="inline-block px-3 py-1 bg-purple-600 rounded-full text-xs font-medium text-white mb-4">
                    FILL IN THE BLANK
                </div>
                <h3 className="text-xl font-semibold text-white leading-relaxed">
                    {question.question}
                </h3>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={showResult || checkAnswerMutation.isPending}
                        placeholder="Type your answer here..."
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl
                                 text-white placeholder-gray-500 
                                 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 
                                 focus:outline-none transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    
                    {/* Loading indicator */}
                    {checkAnswerMutation.isPending && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={!userAnswer.trim() || showResult || checkAnswerMutation.isPending}
                    className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 
                             text-white font-medium rounded-xl transition-all duration-200 
                             transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                             disabled:transform-none"
                >
                    {checkAnswerMutation.isPending ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Checking answer...</span>
                        </div>
                    ) : (
                        'Submit Answer'
                    )}
                </button>

                {/* Hint about validation type */}
                {!showResult && (
                    <div className="text-center text-xs text-gray-400">
                        {question.validation === 'exact' && 'Answer must match exactly'}
                        {question.validation === 'case_insensitive' && 'Case doesn\'t matter'}
                        {question.validation === 'contains' && 'Answer should contain the key term'}
                    </div>
                )}
            </div>

            {/* Result Section */}
            {showResult && (
                <div className="space-y-4">
                    {/* Answer Display */}
                    <div className="bg-gray-700 border border-gray-600 rounded-xl p-4">
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-300">Your answer:</div>
                            <div className="text-white font-medium">{userAnswer}</div>
                            <div className="text-sm font-medium text-gray-300">Correct answer:</div>
                            <div className="text-green-400 font-medium">{question.answer}</div>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className={`p-4 rounded-xl border ${
                        isCorrect 
                            ? 'bg-green-900/50 border-green-700 text-green-200' 
                            : 'bg-red-900/50 border-red-700 text-red-200'
                    }`}>
                        <div className="text-center space-y-2">
                            <div className="text-2xl">
                                {isCorrect ? '🎉' : '❌'}
                            </div>
                            <div className="font-semibold">
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                            </div>
                            {correctionReason && (
                                <div className="text-sm">
                                    {correctionReason}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                        <div className="bg-gray-700 border border-gray-600 rounded-xl p-4">
                            <div className="text-sm font-medium text-gray-300 mb-2">Explanation:</div>
                            <div className="text-gray-200 leading-relaxed">
                                {question.explanation}
                            </div>
                        </div>
                    )}

                    {/* Auto-continue message */}
                    <div className="text-center text-gray-400 text-sm">
                        Moving to next question...
                    </div>
                </div>
            )}
        </div>
    );
}