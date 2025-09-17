'use client';

import { useState, useEffect } from 'react';
import { MultipleChoiceQuestion } from '@/_interfaces/questions/questions';
import { useSound } from '@/hooks/useSound';

interface MultipleChoiceQuestionProps {
    question: MultipleChoiceQuestion;
    onCorrectAnswer: () => void;
    onContinue: () => void;
}

export default function MultipleChoiceQuestionComponent({ 
    question, 
    onCorrectAnswer, 
    onContinue 
}: MultipleChoiceQuestionProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const { playSound } = useSound();

    // Reset state when question changes
    useEffect(() => {
        setSelectedOption(null);
        setShowResult(false);
        setIsCorrect(false);
    }, [question?.id, question?.question]); // Reset when question ID or text changes

    // Debug logging and safety check
    console.log('MultipleChoiceQuestion received:', question);
    
    // Safety check for question data
    if (!question || !question.options || !Array.isArray(question.options)) {
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

    const handleOptionSelect = (optionIndex: number) => {
        if (showResult) return; // Prevent selection after answer

        setSelectedOption(optionIndex);
        const correct = optionIndex === question.correctOption;
        setIsCorrect(correct);
        setShowResult(true);

        // Play sound for correct or incorrect answer
        playSound(correct ? 'correct' : 'incorrect');

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

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-6">
            {/* Question Header */}
            <div className="text-center">
                <div className="inline-block px-3 py-1 bg-blue-600 rounded-full text-xs font-medium text-white mb-4">
                    MULTIPLE CHOICE
                </div>
                <h3 className="text-xl font-semibold text-white leading-relaxed">
                    {question.question}
                </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {question.options.map((option, index) => {
                    let buttonStyles = "w-full p-4 text-left rounded-xl border transition-all duration-200 transform active:scale-95";
                    
                    // Base styles
                    if (!showResult) {
                        buttonStyles += " bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-white";
                    } else {
                        // Result styles
                        if (index === question.correctOption) {
                            // Correct answer - always green
                            buttonStyles += " bg-green-700 border-green-600 text-white";
                        } else if (index === selectedOption && !isCorrect) {
                            // Wrong selected answer - red
                            buttonStyles += " bg-red-700 border-red-600 text-white";
                        } else {
                            // Other options - dimmed
                            buttonStyles += " bg-gray-800 border-gray-700 text-gray-400";
                        }
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            disabled={showResult}
                            className={buttonStyles}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-semibold">
                                    {String.fromCharCode(65 + index)} {/* A, B, C, D */}
                                </div>
                                <div className="flex-1 text-base font-medium">
                                    {option}
                                </div>
                                {showResult && index === question.correctOption && (
                                    <div className="text-green-300">✓</div>
                                )}
                                {showResult && index === selectedOption && !isCorrect && (
                                    <div className="text-red-300">✗</div>
                                )}
                            </div>
                        </button>
                    );
                })}
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