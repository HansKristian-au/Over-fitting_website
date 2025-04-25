export default function inverseMatrix(matrix) {
    const n = matrix.length;
    let identity = matrix.map((row, i) =>
      row.map((_, j) => (i === j ? 1 : 0))
    );
    let augmented = matrix.map((row, i) => row.concat(identity[i]));

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

      let pivot = augmented[i][i];
      if (pivot === 0) {
        throw new Error("Matrix is singular and cannot be inverted.");
      }

      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }

      for (let k = 0; k < n; k++) {
        if (k !== i) {
          let factor = augmented[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }

    return augmented.map(row => row.slice(n));
  }