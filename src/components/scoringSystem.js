export const calculateScore = (userPath, canvasWidth, canvasHeight, functionType, derivatives) => {
    const scaleX = canvasWidth / 8;
    const scaleY = canvasHeight / 8;
    const derivative = derivatives[functionType];
    let totalError = 0;
    let shapePenalty = 0;
    let signErrors = 0;
    let criticalPointErrors = 0;
    const samplePoints = 100;
  
    // Find critical points (where derivative is zero)
    const criticalPoints = [];
    for (let i = 0; i < samplePoints; i++) {
      const x = (i / samplePoints) * canvasWidth;
      const t = (x - canvasWidth / 2) / scaleX;
      if (Math.abs(derivative(t)) < 0.01) {
        criticalPoints.push(x);
      }
    }
  
    for (let i = 0; i < samplePoints; i++) {
      const x = (i / samplePoints) * canvasWidth;
      const t = (x - canvasWidth / 2) / scaleX;
      
      const closestUserPoint = userPath.reduce((closest, point) => {
        return Math.abs(point.x - x) < Math.abs(closest.x - x) ? point : closest;
      }, userPath[0]);
  
      if (!closestUserPoint || typeof closestUserPoint.y === 'undefined') {
        console.log(`Invalid point at index ${i}`);
        continue;
      }
  
      const expectedY = canvasHeight / 2 - scaleY * derivative(t);
      const actualY = closestUserPoint.y;
  
      // Calculate vertical error
      const error = Math.abs(expectedY - actualY) / canvasHeight;
      totalError += error;
  
      // Check for sign errors (heavy penalty)
      if (Math.sign(canvasHeight / 2 - expectedY) !== Math.sign(canvasHeight / 2 - actualY)) {
        signErrors++;
      }
  
      // Check for critical point accuracy
      if (criticalPoints.some(cp => Math.abs(x - cp) < canvasWidth / samplePoints)) {
        if (Math.abs(actualY - canvasHeight / 2) > canvasHeight / 20) {
          criticalPointErrors++;
        }
      }
  
      // Shape accuracy check
      if (i > 0) {
        const prevX = ((i - 1) / samplePoints) * canvasWidth;
        const prevT = (prevX - canvasWidth / 2) / scaleX;
        const prevExpectedY = canvasHeight / 2 - scaleY * derivative(prevT);
        const prevClosestUserPoint = userPath.reduce((closest, point) => {
          return Math.abs(point.x - prevX) < Math.abs(closest.x - prevX) ? point : closest;
        }, userPath[0]);
  
        if (prevClosestUserPoint && typeof prevClosestUserPoint.y !== 'undefined') {
          const expectedSlope = Math.sign(expectedY - prevExpectedY);
          const actualSlope = Math.sign(closestUserPoint.y - prevClosestUserPoint.y);
  
          if (expectedSlope !== 0 && actualSlope !== 0 && expectedSlope !== actualSlope) {
            shapePenalty += 1;
          }
        }
      }
    }
  
    const averageError = totalError / samplePoints;
    const shapeAccuracy = 1 - (shapePenalty / samplePoints);
    const signAccuracy = 1 - (signErrors / samplePoints);
    const criticalPointAccuracy = 1 - (criticalPointErrors / Math.max(1, criticalPoints.length));
  
    // Calculate points based on various factors
    const errorScore = Math.max(0, 100 - (averageError * 200));
    const shapeScore = shapeAccuracy * 100;
    const signScore = signAccuracy * 100;
    const criticalPointScore = criticalPointAccuracy * 100;
  
    // Combine scores with weights
    const points = (errorScore * 0.3) + (shapeScore * 0.2) + (signScore * 0.3) + (criticalPointScore * 0.2);
  
    // Round to nearest integer
    return Math.round(points);
  };
  
  export const getScoreExplanation = () => {
    return (
      <div className="score-system">
        <h3>Scoring System</h3>
        <p>Your drawing is evaluated based on four key factors:</p>
        <ol>
          <li>Value Accuracy (30%): How close your y-values are to the correct derivative.</li>
          <li>Sign Accuracy (30%): Whether you correctly identified positive and negative regions of the derivative.</li>
          <li>Shape Accuracy (20%): How well your drawing captures the overall shape of the derivative.</li>
          <li>Critical Points (20%): Accuracy in identifying where the derivative is zero.</li>
        </ol>
        <p>The final score is calculated by combining these factors:</p>
        <ul>
          <li>90-100: Excellent understanding of the derivative</li>
          <li>80-89: Good grasp of the concept with minor errors</li>
          <li>70-79: Solid understanding, but with some significant mistakes</li>
          <li>60-69: Basic understanding, needs improvement in key areas</li>
          <li>Below 60: Significant misunderstandings, requires more practice</li>
        </ul>
        <p>Pay special attention to:</p>
        <ul>
          <li>The sign of the derivative (positive/negative)</li>
          <li>Where the derivative crosses the x-axis (critical points)</li>
          <li>The overall shape and steepness of the curve</li>
        </ul>
      </div>
    );
  };