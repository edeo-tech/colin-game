'use client';

import { useState, useEffect, useCallback } from 'react';
import { MatchQuestion } from '@/_interfaces/questions/questions';
import { useSound } from '@/hooks/useSound';

interface MatchQuestionProps {
    question: MatchQuestion;
    onCorrectAnswer: () => void;
    onContinue: () => void;
}

interface MatchItem {
    id: string;
    text: string;
    type: 'key' | 'value';
    pairKey: string;
    isMatched: boolean;
    matchedColor?: string;
}

interface Match {
    keyId: string;
    valueId: string;
    color: string;
}

const MATCH_COLORS = [
    'bg-yellow-600 border-yellow-500',
    'bg-green-600 border-green-500', 
    'bg-blue-600 border-blue-500',
    'bg-purple-600 border-purple-500',
    'bg-orange-600 border-orange-500',
    'bg-pink-600 border-pink-500',
    'bg-teal-600 border-teal-500',
    'bg-indigo-600 border-indigo-500'
];

export default function MatchQuestionComponent({ 
    question, 
    onCorrectAnswer, 
    onContinue 
}: MatchQuestionProps) {
    const [leftItems, setLeftItems] = useState<MatchItem[]>([]);
    const [rightItems, setRightItems] = useState<MatchItem[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [wrongMatch, setWrongMatch] = useState<{item1: string, item2: string} | null>(null);
    const { playSound } = useSound();

    // Reset state and randomize items when question changes
    useEffect(() => {
        if (question?.pairs) {
            const pairs = Object.entries(question.pairs);
            
            // Create items for keys (left side)
            const keys: MatchItem[] = pairs.map(([key], index) => ({
                id: `key-${index}`,
                text: key,
                type: 'key',
                pairKey: key,
                isMatched: false
            }));

            // Create items for values (right side)
            const values: MatchItem[] = pairs.map(([key, value], index) => ({
                id: `value-${index}`,
                text: value,
                type: 'value',
                pairKey: key,
                isMatched: false
            }));

            // Randomize the order of both sides
            const shuffledKeys = [...keys].sort(() => Math.random() - 0.5);
            const shuffledValues = [...values].sort(() => Math.random() - 0.5);

            setLeftItems(shuffledKeys);
            setRightItems(shuffledValues);
        }
        
        setMatches([]);
        setSelectedItem(null);
        setShowResult(false);
        setIsCorrect(false);
        setWrongMatch(null);
    }, [question?.id, question?.pairs]);

    const handleAutoSubmit = useCallback(() => {
        // Check if all matches are correct
        const allCorrect = matches.length === Object.keys(question.pairs).length;
        setIsCorrect(allCorrect);
        setShowResult(true);

        // Play sound for correct or incorrect answer
        playSound(allCorrect ? 'correct' : 'incorrect');

        if (allCorrect) {
            // Auto move to next question after delay
            setTimeout(() => {
                onCorrectAnswer();
            }, 1500);
        } else {
            // Auto move to next question after delay for incorrect too
            setTimeout(() => {
                onContinue();
            }, 2500); // Give more time to see what was wrong
        }
    }, [matches.length, question.pairs, onCorrectAnswer, onContinue, playSound]);

    // Auto-submit when all pairs are matched
    useEffect(() => {
        if (leftItems.length > 0 && matches.length === leftItems.length && !showResult) {
            // Small delay to show the final match before submitting
            setTimeout(() => {
                handleAutoSubmit();
            }, 500);
        }
    }, [matches.length, leftItems.length, showResult, handleAutoSubmit]);

    // Safety check for question data
    if (!question || !question.pairs) {
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

    const handleItemClick = (itemId: string) => {
        if (showResult || wrongMatch) return; // Disable clicking during wrong match feedback or results

        const clickedItem = [...leftItems, ...rightItems].find(item => item.id === itemId);
        if (!clickedItem || clickedItem.isMatched) return;

        if (selectedItem === null) {
            // First selection
            setSelectedItem(itemId);
        } else if (selectedItem === itemId) {
            // Deselect same item
            setSelectedItem(null);
        } else {
            // Second selection - check if it's a valid match
            const firstItem = [...leftItems, ...rightItems].find(item => item.id === selectedItem);
            const secondItem = clickedItem;

            if (firstItem && secondItem && firstItem.type !== secondItem.type) {
                // Different types (key vs value), check if they match
                if (firstItem.pairKey === secondItem.pairKey) {
                    // Valid match!
                    const colorIndex = matches.length % MATCH_COLORS.length;
                    const matchColor = MATCH_COLORS[colorIndex];
                    
                    const newMatch: Match = {
                        keyId: firstItem.type === 'key' ? firstItem.id : secondItem.id,
                        valueId: firstItem.type === 'value' ? firstItem.id : secondItem.id,
                        color: matchColor
                    };

                    setMatches(prev => [...prev, newMatch]);

                    // Update items to mark as matched
                    setLeftItems(prev => prev.map(item => 
                        item.id === firstItem.id || item.id === secondItem.id 
                            ? { ...item, isMatched: true, matchedColor: matchColor }
                            : item
                    ));
                    setRightItems(prev => prev.map(item => 
                        item.id === firstItem.id || item.id === secondItem.id 
                            ? { ...item, isMatched: true, matchedColor: matchColor }
                            : item
                    ));
                } else {
                    // Wrong match! Show immediate feedback and fail the question
                    setWrongMatch({
                        item1: firstItem.id,
                        item2: secondItem.id
                    });
                    
                    // Show the wrong match briefly, then fail the question
                    setTimeout(() => {
                        setIsCorrect(false);
                        setShowResult(true);
                        
                        // Play incorrect sound
                        playSound('incorrect');
                        
                        // Auto-navigate to next question after showing the wrong match
                        setTimeout(() => {
                            onContinue();
                        }, 2500); // Give time to see what was wrong
                    }, 1000);
                }
            }
            
            setSelectedItem(null);
        }
    };

    const getItemStyles = (item: MatchItem) => {
        let baseStyles = "w-full p-4 rounded-xl border transition-all duration-200 cursor-pointer text-center font-medium ";
        
        if (item.isMatched) {
            baseStyles += `${item.matchedColor} text-white shadow-lg `;
        } else if (wrongMatch && (wrongMatch.item1 === item.id || wrongMatch.item2 === item.id)) {
            // Wrong match - show in red with shake animation
            baseStyles += "bg-red-700 border-red-600 text-white animate-pulse ring-2 ring-red-500 ";
        } else if (selectedItem === item.id) {
            baseStyles += "bg-gray-600 border-gray-500 text-white ring-2 ring-cyan-500 scale-105 ";
        } else if (showResult) {
            // Disabled state when showing results
            baseStyles += "bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed ";
        } else {
            baseStyles += "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-white hover:scale-102 ";
        }

        return baseStyles;
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-6">
            {/* Question Header */}
            <div className="text-center">
                <div className="inline-block px-3 py-1 bg-cyan-600 rounded-full text-xs font-medium text-white mb-4">
                    MATCH PAIRS
                </div>
                <h3 className="text-xl font-semibold text-white leading-relaxed">
                    {question.question}
                </h3>
            </div>

            {/* Instructions */}
            {!showResult && (
                <div className="text-center text-sm text-gray-400">
                    Tap items to match them. Each pair will get a different color when matched.
                </div>
            )}

            {/* Matching Interface */}
            <div className="grid grid-cols-2 gap-6">
                {/* Left Column (Keys) */}
                <div className="space-y-3">
                    <div className="text-center text-sm font-medium text-gray-300 mb-4">
                        Match these →
                    </div>
                    {leftItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className={getItemStyles(item)}
                        >
                            {item.text}
                        </div>
                    ))}
                </div>

                {/* Right Column (Values) */}
                <div className="space-y-3">
                    <div className="text-center text-sm font-medium text-gray-300 mb-4">
                        ← With these
                    </div>
                    {rightItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className={getItemStyles(item)}
                        >
                            {item.text}
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress Indicator */}
            {!showResult && !wrongMatch && (
                <div className="text-center">
                    <div className="text-sm text-gray-400">
                        Matched: {matches.length} / {Object.keys(question.pairs).length}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                            className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(matches.length / Object.keys(question.pairs).length) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Wrong Match Feedback */}
            {wrongMatch && !showResult && (
                <div className="text-center">
                    <div className="p-4 rounded-xl bg-red-900/50 border border-red-700">
                        <div className="text-red-200 font-semibold">❌ Wrong Match!</div>
                        <div className="text-red-300 text-sm mt-1">These items don&apos;t belong together</div>
                    </div>
                </div>
            )}

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
                                {isCorrect ? 'All Pairs Matched!' : 'Incorrect Matches'}
                            </div>
                            <div className="text-sm">
                                You matched {matches.length} out of {Object.keys(question.pairs).length} pairs correctly
                            </div>
                        </div>
                    </div>

                    {/* Correct Pairs Display */}
                    <div className="bg-gray-700 border border-gray-600 rounded-xl p-4">
                        <div className="text-sm font-medium text-gray-300 mb-3">Correct pairs:</div>
                        <div className="space-y-2">
                            {Object.entries(question.pairs).map(([key, value], index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                                    <span className="text-white font-medium">{key}</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="h-px bg-gray-500 flex-1 w-8"></div>
                                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-green-400 font-medium">{value}</span>
                                </div>
                            ))}
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