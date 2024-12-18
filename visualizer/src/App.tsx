import React, { useState } from 'react';
import { MindMap } from './components/mindmap/MindMap';
import { MindMapInput } from './components/input/MindMapInput';
import { parseInput } from './utils/mindmapParser';

const SAMPLE_INPUT = `AI: Artificial Intelligence (AI) is transforming various industries.
|-Machine Learning (ML): Focuses on algorithms
||--Supervised Learning: Involves training models with labeled data
|||--Classification: Assigning data points to predefined categories
|||--Regression: Predicting numerical values
||--Unsupervised Learning: Deals with unlabeled data
|||--Clustering: Grouping similar data points together
|||--Dimensionality Reduction: Reducing the number of features in data
||--Deep Learning: Subset of ML that uses neural networks
|||--Artificial Neural Networks (ANNs): Inspired by biological neurons
|||--Convolutional Neural Networks (CNNs): Used for image and video analysis
|||--Recurrent Neural Networks (RNNs): Used for sequential data like text and time series`;

function App() {
  const [input, setInput] = useState(SAMPLE_INPUT);
  const [mindMapData, setMindMapData] = useState(() => parseInput(SAMPLE_INPUT));

  const handleGenerate = () => {
    try {
      const data = parseInput(input);
      setMindMapData(data);
    } catch (error) {
      console.error('Failed to parse mindmap:', error);
      alert('Invalid mindmap format. Please check your input.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Interactive Mind Map Generator
        </h1>
        
        <MindMapInput 
          value={input} 
          onChange={setInput} 
          onGenerate={handleGenerate} 
        />
        
        <div className="bg-gray-800 rounded-xl shadow-2xl p-4">
          <MindMap node={mindMapData} />
        </div>
      </div>
    </div>
  );
}

export default App;