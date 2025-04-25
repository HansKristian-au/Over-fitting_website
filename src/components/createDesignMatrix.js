export default function createDesignMatrix(data) {
   return data.map(row => [1, ...row]);
  }

