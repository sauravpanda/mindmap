'use client'

import { useState } from 'react'
import MindmapEditor from '../components/MindmapEditor'
import MindmapVisualizer from '../components/MindmapVisualizer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const defaultMindmapData = `AI: Artificial Intelligence (AI) is transforming various industries.
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
|||--Recurrent Neural Networks (RNNs): Used for sequential data like text and time series`

export default function Home() {
  const [mindmapData, setMindmapData] = useState(defaultMindmapData)

  return (
    <div className="min-h-screen bg-[#1B1E27] text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">Interactive Mind Map Generator</h1>
        
        <div className="flex justify-between mb-4">
          <Select defaultValue="ai-overview">
            <SelectTrigger className="w-[200px] bg-[#2A2F3B] border-none">
              <SelectValue placeholder="Select overview" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai-overview">AI Overview</SelectItem>
              <SelectItem value="ml-overview">ML Overview</SelectItem>
              <SelectItem value="dl-overview">DL Overview</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="secondary"
            className="bg-[#2A2F3B] hover:bg-[#363B47] text-white"
          >
            Create New
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#232731] rounded-lg p-4">
          <MindmapEditor
            value={mindmapData}
            onChange={setMindmapData}
          />
          <MindmapVisualizer data={mindmapData} />
        </div>
      </div>
    </div>
  )
}

