'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/auth/AuthContext';
import { useGetAllQuestions } from '@/_queries/questions/questions';
import { useSubmitScore } from '@/_queries/leaderboard/leaderboard';
import { Question, MultipleChoiceQuestion, TrueFalseQuestion, FillBlankQuestion, MatchQuestion } from '@/_interfaces/questions/questions';
import Link from 'next/link';
import MultipleChoiceQuestionComponent from '@/components/questions/MultipleChoiceQuestion';
import TrueFalseQuestionComponent from '@/components/questions/TrueFalseQuestion';
import FillBlankQuestionComponent from '@/components/questions/FillBlankQuestion';
import MatchQuestionComponent from '@/components/questions/MatchQuestion';
import { useSound } from '@/hooks/useSound';
import Confetti from '@/components/ui/Confetti';
import ShareModal from '@/components/ui/ShareModal';

type QuizState = 'waiting' | 'playing' | 'finished';

export default function Quiz() {
    const { auth, logout, logoutLoading } = useAuth();
    const queryClient = useQueryClient();
    const { playSound } = useSound();
    
    // Fetch all questions and randomize them
    const { data: questionsData, isLoading: questionsLoading, error } = useGetAllQuestions();
    
    // Filter out order and fill_blank questions and randomize the remaining questions
    const allQuestions = useMemo(() => {
        if (!questionsData || questionsData.length === 0) return [];
        // Filter out order and fill_blank type questions
        const filteredQuestions = questionsData.filter(q => q.type !== 'order' && q.type !== 'fill_blank');
        return [...filteredQuestions].sort(() => Math.random() - 0.5);
    }, [questionsData]);

    // Score submission mutation with query invalidation
    const submitScoreMutation = useSubmitScore();

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
    const [showConfetti, setShowConfetti] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

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
            // Play lesson complete sound and show confetti
            playSound('complete');
            setShowConfetti(true);
            // Submit score to leaderboard when quiz finishes
            if (auth) {
                submitScoreMutation.mutate({
                    username: auth.username,
                    user_id: auth.id,
                    score: score,
                    school_id: auth.school_id // Include school_id if user has one
                }, {
                    onSuccess: () => {
                        // Invalidate all leaderboard queries to refresh the data
                        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
                    }
                });
            }
        }
    }, [quizState, timeLeft, score, auth, submitScoreMutation, queryClient, playSound]);

    // Play again
    const playAgain = () => {
        setQuizState('waiting');
        setShowConfetti(false);
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
                            <span className="text-gray-300 hidden sm:block">
                                Welcome, {auth.username}! 
                                <span className="text-gray-400 text-sm ml-2">({auth.role})</span>
                            </span>
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
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                            {/* Animated Progress Bar Background */}
                            <div className="relative">
                                <div 
                                    className="h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-1000 ease-linear"
                                    style={{ 
                                        width: `${((60 - timeLeft) / 60) * 100}%`,
                                        transition: timeLeft === 60 ? 'none' : 'width 1s linear'
                                    }}
                                />
                                <div className="absolute inset-0 h-2 bg-gray-700" style={{ zIndex: -1 }} />
                            </div>
                            
                            {/* Stats Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-center">
                                    <div className="text-center">
                                        <div className={`text-2xl font-bold transition-colors duration-500 ${
                                            timeLeft <= 10 ? 'text-red-400 animate-pulse' : 
                                            timeLeft <= 20 ? 'text-yellow-400' : 'text-green-400'
                                        }`}>
                                            {timeLeft}
                                        </div>
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
                        </div>

                        {/* Current Question Component */}
                        {currentQuestion ? (
                            <>
                                {currentQuestion.type === 'multiple_choice' && (
                                    <MultipleChoiceQuestionComponent
                                        question={currentQuestion as MultipleChoiceQuestion}
                                        onCorrectAnswer={handleCorrectAnswer}
                                        onContinue={handleContinue}
                                    />
                                )}
                                {currentQuestion.type === 'true_false' && (
                                    <TrueFalseQuestionComponent
                                        question={currentQuestion as TrueFalseQuestion}
                                        onCorrectAnswer={handleCorrectAnswer}
                                        onContinue={handleContinue}
                                    />
                                )}
                                {currentQuestion.type === 'fill_blank' && (
                                    <FillBlankQuestionComponent
                                        question={currentQuestion as FillBlankQuestion}
                                        onCorrectAnswer={handleCorrectAnswer}
                                        onContinue={handleContinue}
                                    />
                                )}
                                {currentQuestion.type === 'match' && (
                                    <MatchQuestionComponent
                                        question={currentQuestion as MatchQuestion}
                                        onCorrectAnswer={handleCorrectAnswer}
                                        onContinue={handleContinue}
                                    />
                                )}
                                {!['multiple_choice', 'true_false', 'fill_blank', 'match'].includes(currentQuestion.type) && (
                                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
                                        <div className="text-red-300">
                                            Error: Unknown question type &quot;{currentQuestion.type}&quot;
                                        </div>
                                        <pre className="mt-2 text-xs text-gray-400">
                                            {JSON.stringify(currentQuestion, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
                                <div className="text-red-300">
                                    Error: No question available
                                </div>
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

                        {/* Share Section */}
                        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6 space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">🚀 GET YOUR SCHOOL UP THE LEADERBOARD</h3>
                                <p className="text-purple-200 font-medium">SHARE WITH FRIENDS!</p>
                                <p className="text-sm text-gray-300">Every point counts towards your school&apos;s ranking</p>
                            </div>
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                                         text-white font-medium rounded-xl transition-all duration-200 transform active:scale-95
                                         shadow-lg shadow-purple-600/25"
                            >
                                <span className="flex items-center justify-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                    </svg>
                                    <span>Share Game</span>
                                </span>
                            </button>
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

            {/* Confetti Animation */}
            {showConfetti && <Confetti duration={3000} pieceCount={75} />}

            {/* Share Modal */}
            <ShareModal 
                isOpen={showShareModal} 
                onClose={() => setShowShareModal(false)} 
            />
        </div>
    );
}