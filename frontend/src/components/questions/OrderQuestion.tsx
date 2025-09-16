'use client';

import { useState, useEffect } from 'react';
import { OrderQuestion } from '@/_interfaces/questions/questions';

interface OrderQuestionProps {
    question: OrderQuestion;
    onCorrectAnswer: () => void;
    onContinue: () => void;
}

interface DraggableItem {
    id: string;
    text: string;
    originalIndex: number;
}

export default function OrderQuestionComponent({ 
    question, 
    onCorrectAnswer, 
    onContinue 
}: OrderQuestionProps) {
    const [items, setItems] = useState<DraggableItem[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Reset state and randomize items when question changes
    useEffect(() => {
        if (question?.items) {
            // Create draggable items with original indices
            const draggableItems: DraggableItem[] = question.items.map((item, index) => ({
                id: `item-${index}`,
                text: item,
                originalIndex: index
            }));
            
            // Randomize the order
            const shuffled = [...draggableItems].sort(() => Math.random() - 0.5);
            setItems(shuffled);
        }
        
        setShowResult(false);
        setIsCorrect(false);
        setDraggedIndex(null);
        setDragOverIndex(null);
    }, [question?.id, question?.items]);

    // Safety check for question data
    if (!question || !question.items || !question.correctOrder) {
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

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', ''); // Required for some browsers
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        if (draggedIndex !== null && draggedIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragLeave = () => {
        // Small timeout to prevent flickering when moving between elements
        setTimeout(() => setDragOverIndex(null), 50);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const newItems = [...items];
        const draggedItem = newItems[draggedIndex];
        
        // Remove the dragged item
        newItems.splice(draggedIndex, 1);
        // Insert it at the new position (adjust index if dragging down)
        const adjustedDropIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
        newItems.splice(adjustedDropIndex, 0, draggedItem);
        
        setItems(newItems);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleSubmit = () => {
        if (showResult) return;

        // Check if the current order matches the correct order
        const currentOrder = items.map(item => item.originalIndex);
        const correct = JSON.stringify(currentOrder) === JSON.stringify(question.correctOrder);
        
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            // Auto move to next question after short delay for correct answers
            setTimeout(() => {
                onCorrectAnswer();
            }, 1500);
        } else {
            // Auto move to next question after delay for incorrect answers too
            setTimeout(() => {
                onContinue();
            }, 2500); // Give more time to read the explanation
        }
    };

    const handleContinue = () => {
        onContinue();
    };

    const getCorrectOrderText = () => {
        return question.correctOrder.map(index => question.items[index]).join(' → ');
    };

    const getCurrentOrderText = () => {
        return items.map(item => item.text).join(' → ');
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-6">
            {/* Question Header */}
            <div className="text-center">
                <div className="inline-block px-3 py-1 bg-yellow-600 rounded-full text-xs font-medium text-white mb-4">
                    ARRANGE IN ORDER
                </div>
                <h3 className="text-xl font-semibold text-white leading-relaxed">
                    {question.question}
                </h3>
            </div>

            {/* Draggable Items */}
            <div className="relative">
                <div className="text-sm text-gray-400 text-center mb-4">
                    Drag items to reorder them from top to bottom
                </div>
                
                <div className="space-y-3">
                    {items.map((item, index) => {
                        const isDragged = draggedIndex === index;
                        const isDropTarget = dragOverIndex === index;
                        
                        return (
                            <div key={item.id} className="relative">
                                {/* Drop zone indicator - shows above current item when dragging over */}
                                {isDropTarget && draggedIndex !== null && draggedIndex > index && (
                                    <div className="absolute -top-2 left-0 right-0 h-1 bg-yellow-500 rounded-full z-10 animate-pulse" />
                                )}
                                
                                <div
                                    draggable={!showResult}
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, index)}
                                    className={`
                                        w-full p-4 rounded-xl border transition-all duration-300 cursor-move relative z-0
                                        ${!showResult 
                                            ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-white hover:shadow-lg" 
                                            : "bg-gray-800 border-gray-700 text-gray-300 cursor-default"
                                        }
                                        ${isDragged 
                                            ? "opacity-30 scale-95 rotate-1 z-50 shadow-2xl ring-2 ring-yellow-500" 
                                            : ""
                                        }
                                        ${isDropTarget && !isDragged 
                                            ? "transform scale-105 bg-yellow-900/30 border-yellow-500" 
                                            : ""
                                        }
                                        ${!isDragged && !isDropTarget 
                                            ? "hover:scale-[1.02]" 
                                            : ""
                                        }
                                    `}
                                    style={{
                                        transform: `translateY(${
                                            isDropTarget && draggedIndex !== null && draggedIndex < index 
                                                ? '20px' 
                                                : isDropTarget && draggedIndex !== null && draggedIndex > index
                                                ? '-20px'
                                                : '0px'
                                        }) ${isDragged ? 'rotate(2deg) scale(0.95)' : 'rotate(0deg) scale(1)'}`,
                                        zIndex: isDragged ? 1000 : 'auto'
                                    }}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center font-semibold text-white text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 text-base font-medium">
                                            {item.text}
                                        </div>
                                        {!showResult && (
                                            <div className="text-gray-400">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Drop zone indicator - shows below current item when dragging over */}
                                {isDropTarget && draggedIndex !== null && draggedIndex < index && (
                                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-500 rounded-full z-10 animate-pulse" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Submit Button */}
            {!showResult && (
                <button
                    onClick={handleSubmit}
                    className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 
                             text-white font-medium rounded-xl transition-all duration-200 
                             transform active:scale-95"
                >
                    Submit Order
                </button>
            )}

            {/* Result Section */}
            {showResult && (
                <div className="space-y-4">
                    {/* Order Display */}
                    <div className="bg-gray-700 border border-gray-600 rounded-xl p-4">
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm font-medium text-gray-300 mb-1">Your order:</div>
                                <div className="text-white font-medium text-sm">{getCurrentOrderText()}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-300 mb-1">Correct order:</div>
                                <div className="text-green-400 font-medium text-sm">{getCorrectOrderText()}</div>
                            </div>
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
                                {isCorrect ? 'Correct Order!' : 'Incorrect Order'}
                            </div>
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