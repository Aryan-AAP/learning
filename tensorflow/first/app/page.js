"use client";

import { useState } from "react";
import * as tf from "@tensorflow/tfjs";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [prediction, setPrediction] = useState(null);

  async function handleClick() {
    // Create a simple model.
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

    // Generate some synthetic data for training. (y = 2x - 1)
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    // Train the model using the data.
    await model.fit(xs, ys, { epochs: 250 });

    // Convert input to a number and make a prediction
    const inputNumber = parseFloat(inputValue);
    const output = model.predict(tf.tensor2d([inputNumber], [1, 1])) ;
    const predictedValue = (await output.data())[0]; // Get the predicted value
    setPrediction(predictedValue); // Store the prediction in state
  }

  return (
    <main>
      <h1>Linear Regression Predictor</h1>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a value"
      />
      <button onClick={handleClick}>Predict</button>
      {prediction !== null && <p>Predicted value for x={inputValue}: {prediction}</p>}
    </main>
  );
}
