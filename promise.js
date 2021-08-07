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

sum(7, 10)
  .then((total) => sum(total, 10))
  .then((total1) => sum(total1, 10))
  .then((total2) => {
    console.log(total2);
  })
  .catch((err) => {
    console.log(err);
  });