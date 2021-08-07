let sum = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof a != "number" || typeof b != "number") {
        return reject("Gia tri nhap vao phai la so.");
      }
      resolve(a + b);
    }, 1000);
  });
}

(async () => {
  try {
    let total01 = await sum(7, 10);
    let total02 = await sum(total01, 10);
    let total03 = await sum(total02, 10);
    console.log(total03);
  } catch (error) {
    console.log(error);
  }
})();