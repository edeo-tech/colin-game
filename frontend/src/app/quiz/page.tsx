'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/auth/AuthContext';
import { useGetQuestionsByType } from '@/_queries/questions/questions';
import { Question, MatchQuestion } from '@/_interfaces/questions/questions';
import Link from 'next/link';
import MatchQuestionComponent from '@/components/questions/MatchQuestion';

type QuizState = 'waiting' | 'playing' | 'finished';

export default function Quiz() {
    const { auth, logout, logoutLoading } = useAuth();
    
    // Fetch match questions only
    const { data: allQuestions, isLoading: questionsLoading, error } = useGetQuestionsByType('match');

    // Debug logging (commented out to prevent constant logging)
    // console.log('Quiz data:', { 
    //     allQuestions, 
    //     isLoading: questionsLoading, 
    //     error 
    // });

    // Quiz state
    const [quizState, setQuizState] = useState<QuizState>('waiting');
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [questionCount, setQuestionCount] = useState(0);

    // Shuffle and get random question
    const getRandomQuestion = useCallback(() => {
        if (!allQuestions || allQuestions.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        return allQuestions[randomIndex];
    }, [allQuestions]);

    // Start quiz
    const startQuiz = useCallback(() => {
        if (!allQuestions || allQuestions.length === 0) return;
        
        setQuizState('playing');
        setScore(0);
        setTimeLeft(60);
        setQuestionCount(0);
        setCurrentQuestion(getRandomQuestion());
    }, [allQuestions, getRandomQuestion]);

    // Handle correct answer
    const handleCorrectAnswer = useCallback(() => {
        setScore(prev => prev + 1);
        setQuestionCount(prev => prev + 1);
        setCurrentQuestion(getRandomQuestion());
    }, [getRandomQuestion]);

    // Handle continue (wrong answer)
    const handleContinue = useCallback(() => {
        setQuestionCount(prev => prev + 1);
        setCurrentQuestion(getRandomQuestion());
    }, [getRandomQuestion]);

    // Timer effect
    useEffect(() => {
        if (quizState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (quizState === 'playing' && timeLeft === 0) {
            setQuizState('finished');
        }
    }, [quizState, timeLeft]);

    // Play again
    const playAgain = () => {
        setQuizState('waiting');
    };

    const handleLogout = () => {
        logout();
    };

    if (!auth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navigation */}
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link 
                                href="/home"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                ←
                            </Link>
                            <h1 className="text-xl font-semibold text-white">Quiz</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-300 hidden sm:block">Welcome, {auth.username}!</span>
                            <button
                                onClick={handleLogout}
                                disabled={logoutLoading}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {logoutLoading ? 'Logging out...' : 'Logout'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Loading State */}
                {questionsLoading && (
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
                        <div className="text-white text-lg">Loading questions...</div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-900 border border-red-700 rounded-2xl p-8 text-center">
                        <div className="text-red-300 text-lg">Failed to load questions. Please try again.</div>
                    </div>
                )}

                {/* Waiting State - Start Quiz */}
                {quizState === 'waiting' && allQuestions && (
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">Ready to Quiz?</h2>
                            <p className="text-gray-300 text-lg mb-2">Answer as many questions as you can in 60 seconds!</p>
                            <p className="text-gray-400">Questions loaded: {allQuestions.length}</p>
                        </div>
                        
                        <button
                            onClick={startQuiz}
                            className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                                     text-white font-semibold text-xl rounded-xl 
                                     transition-all duration-200 transform active:scale-95
                                     shadow-xl shadow-blue-600/20"
                        >
                            Start Quiz
                        </button>
                    </div>
                )}

                {/* Playing State */}
                {quizState === 'playing' && currentQuestion && (
                    <>
                        {/* Timer and Score Header */}
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                            <div className="flex justify-between items-center">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{timeLeft}</div>
                                    <div className="text-sm text-gray-400">seconds</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-400">{score}</div>
                                    <div className="text-sm text-gray-400">score</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-400">{questionCount + 1}</div>
                                    <div className="text-sm text-gray-400">question</div>
                                </div>
                            </div>
                        </div>

                        {/* Current Question Component */}
                        {currentQuestion && currentQuestion.type === 'match' ? (
                            <MatchQuestionComponent
                                question={currentQuestion as MatchQuestion}
                                onCorrectAnswer={handleCorrectAnswer}
                                onContinue={handleContinue}
                            />
                        ) : (
                            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
                                <div className="text-red-300">
                                    Error: Invalid question type or no question available
                                </div>
                                <pre className="mt-2 text-xs text-gray-400">
                                    {JSON.stringify(currentQuestion, null, 2)}
                                </pre>
                            </div>
                        )}
                    </>
                )}

                {/* Finished State */}
                {quizState === 'finished' && (
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center space-y-6">
                        {/* Celebration */}
                        <div className="space-y-4">
                            <div className="text-6xl">🎉</div>
                            <h2 className="text-3xl font-bold text-white">Quiz Complete!</h2>
                            <div className="space-y-2">
                                <div className="text-5xl font-bold text-blue-400">{score}</div>
                                <div className="text-xl text-gray-300">
                                    {score === 1 ? 'point' : 'points'} in 60 seconds
                                </div>
                                <div className="text-gray-400">
                                    Answered {questionCount} {questionCount === 1 ? 'question' : 'questions'}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button
                                onClick={playAgain}
                                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                                         text-white font-medium rounded-xl transition-all duration-200 
                                         transform active:scale-95"
                            >
                                Play Again
                            </button>
                            
                            <Link
                                href="/leaderboards"
                                className="block w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 
                                         text-white font-medium rounded-xl transition-all duration-200 
                                         transform active:scale-95 text-center"
                            >
                                View Leaderboards
                            </Link>
                            
                            <Link
                                href="/home"
                                className="block w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 
                                         text-white font-medium rounded-xl transition-all duration-200 
                                         transform active:scale-95 text-center"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}