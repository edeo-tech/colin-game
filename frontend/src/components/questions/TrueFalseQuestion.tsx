'use client';

import { useState, useEffect } from 'react';
import { TrueFalseQuestion } from '@/_interfaces/questions/questions';

interface TrueFalseQuestionProps {
    question: TrueFalseQuestion;
    onCorrectAnswer: () => void;
    onContinue: () => void;
}

export default function TrueFalseQuestionComponent({ 
    question, 
    onCorrectAnswer, 
    onContinue 
}: TrueFalseQuestionProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // Reset state when question changes
    useEffect(() => {
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
    }, [question?.id, question?.statement]); // Reset when question ID or statement changes

    // Debug logging and safety check
    console.log('TrueFalseQuestion received:', question);
    
    // Safety check for question data
    if (!question || !question.statement) {
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

    const handleAnswerSelect = (answer: boolean) => {
        if (showResult) return; // Prevent selection after answer

        setSelectedAnswer(answer);
        const correct = answer === question.answer;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            // Auto move to next question after short delay for correct answers
            setTimeout(() => {
                onCorrectAnswer();
            }, 1000);
        } else {
            // Auto move to next question after delay for incorrect answers too
            setTimeout(() => {
                onContinue();
            }, 2000); // Give a bit more time to read the explanation
        }
    };

    const handleContinue = () => {
        onContinue();
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-6">
            {/* Question Header */}
            <div className="text-center">
                <div className="inline-block px-3 py-1 bg-green-600 rounded-full text-xs font-medium text-white mb-4">
                    TRUE / FALSE
                </div>
                <h3 className="text-xl font-semibold text-white leading-relaxed">
                    {question.statement}
                </h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
                {/* True Option */}
                <button
                    onClick={() => handleAnswerSelect(true)}
                    disabled={showResult}
                    className={`w-full p-4 text-left rounded-xl border transition-all duration-200 transform active:scale-95 ${
                        !showResult
                            ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-white"
                            : question.answer === true
                            ? "bg-green-700 border-green-600 text-white"
                            : selectedAnswer === true && !isCorrect
                            ? "bg-red-700 border-red-600 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-400"
                    }`}
                >
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-semibold">
                            T
                        </div>
                        <div className="flex-1 text-base font-medium">
                            True
                        </div>
                        {showResult && question.answer === true && (
                            <div className="text-green-300">✓</div>
                        )}
                        {showResult && selectedAnswer === true && !isCorrect && (
                            <div className="text-red-300">✗</div>
                        )}
                    </div>
                </button>

                {/* False Option */}
                <button
                    onClick={() => handleAnswerSelect(false)}
                    disabled={showResult}
                    className={`w-full p-4 text-left rounded-xl border transition-all duration-200 transform active:scale-95 ${
                        !showResult
                            ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-white"
                            : question.answer === false
                            ? "bg-green-700 border-green-600 text-white"
                            : selectedAnswer === false && !isCorrect
                            ? "bg-red-700 border-red-600 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-400"
                    }`}
                >
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-semibold">
                            F
                        </div>
                        <div className="flex-1 text-base font-medium">
                            False
                        </div>
                        {showResult && question.answer === false && (
                            <div className="text-green-300">✓</div>
                        )}
                        {showResult && selectedAnswer === false && !isCorrect && (
                            <div className="text-red-300">✗</div>
                        )}
                    </div>
                </button>
            </div>

            {/* Result Section */}
            {showResult && (
                <div className="space-y-4">
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
                            <div className="text-sm">
                                The correct answer is: <span className="font-semibold">
                                    {question.answer ? 'True' : 'False'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-gray-700 border border-gray-600 rounded-xl p-4">
                        <div className="text-sm font-medium text-gray-300 mb-2">Explanation:</div>
                        <div className="text-gray-200 leading-relaxed">
                            {question.explanation}
                        </div>
                    </div>

                    {/* Auto-continue message */}
                    <div className="text-center text-gray-400 text-sm">
                        Moving to next question...
                    </div>
                </div>
            )}
        </div>
    );
}