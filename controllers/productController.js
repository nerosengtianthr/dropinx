const DAMMY_DATA = require("../data/DUMMY_DATA");

const getProducts = async (req, res) => {
  const { products } = DAMMY_DATA;

  const { limit, page, sort_by } = req.query;

  const currentPage = page || 1;
  const productPerPage = limit || 2;
  const indexOfLast = currentPage * productPerPage;
  const indexOfFirst = indexOfLast - productPerPage;

  var current = products.slice(indexOfFirst, indexOfLast);
  const product_length = current.length;

  if (sort_by) {
    current = current.sort((a, b) => b[sort_by] - a[sort_by]);
  }

  return res.status(200).send({
    success: true,
    length: product_length,
    current_page: currentPage,
    result: current,
  });
};

const buy = (req, res) => {
  const { products } = DAMMY_DATA;

  // simulate If these is data comming from req
  //   [
  //     { pid: "2", qty: 2 },
  //     { pid: "3", qty: 2 },
  //     { pid: "1", qty: 2 },
  //     { pid: "1", qty: 2 },
  //   ];
  const orders = req.body.products;

  // put price into every pid
  const genNewData = [];
  for (let i = 0; i < orders.length; i++) {
    for (let j = 0; j < products.length; j++) {
      if (orders[i]["pid"] == products[j]["id"]) {
        genNewData.push({ ...orders[i], price: products[j]["price"] });
      }
    }
  }

  // sum (price,qty) duplicate pid with our data
  var result_sum_duplicate = [];
  genNewData.forEach(function (a) {
    if (!this[a.pid]) {
      this[a.pid] = { pid: a.pid, qty: 0, price: 0 };
      result_sum_duplicate.push(this[a.pid]);
    }
    this[a.pid].qty += a.qty;
    this[a.pid].price += a.price * a.qty;
  }, Object.create(null));

  // sum total price return to customer
  const initialValue = 0;
  const sumWithInitial = result_sum_duplicate.reduce(
    (total, item) => item.price + total,
    initialValue
  );

  // return to frontend
  return res.status(200).send({
    success: true,
    result: result_sum_duplicate,
    total: sumWithInitial,
  });
};

module.exports = { getProducts, buy };
