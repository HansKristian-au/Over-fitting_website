export default function multiplyMatrices(A, B) {
    if (A[0].length !== B.length) {
      throw new Error("Number of columns in A must match number of rows in B");
    }
    return A.map(row =>
      B[0].map((_, colIndex) =>
        row.reduce((sum, value, rowIndex) => sum + value * B[rowIndex][colIndex], 0)
      )
    );
  }