import ProductModel from './product.model.js';
import ProductRepository from './product.repository.js';

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      res.status(400).send("Something went wrong");
    }
  }

  async addProduct(req, res) {
    try {
      console.log(req.body);
      const { name, price, sizes, desc, categories } = req.body;
      // const newProduct = {
      //   name,
      //   price: parseFloat(price),
      //   sizes: sizes.split(','),
      //   imageUrl: req.file.filename,
      // };
      const newProduct = new ProductModel(name, desc, parseFloat(price), req.file.filename, categories, sizes.split(','));

      // const createdRecord = ProductModel.add(newProduct);
      const createdRecord = await this.productRepository.add(newProduct);
      res.status(201).send(createdRecord);
    } catch (err) {
      console.log(err);
      res.status(400).send("Something went wrong");
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      // const product = ProductModel.get(id);
      const product = await this.productRepository.get(id);
      if (!product) {
        res.status(404).send('Product not found');
      } else {
        return res.status(200).send(product);
      }
    } catch (err) {
      console.log(err);
      res.status(400).send("Something went wrong");
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;
      // const result = ProductModel.filter(minPrice, maxPrice, category);
      const result = await this.productRepository.filter(minPrice, maxPrice, category);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(400).send("Something went wrong");
    }
  }

  async rateProduct(req, res) {
    // console.log(req.query);
    try {
      // const userID = req.query.userID;
      const userID = req.userID;//fetch from jwtpayload
      const productID = req.body.productID;
      const rating = req.body.rating;
      // const error = ProductModel.rateProduct(userID, productID, rating);
      // console.log(error);
      // if (error) {
      //   return res.status(400).send(error);
      // } else {
      //   return res.status(200).send('Rating has been added');
      // }

      // try {
      //   ProductModel.rateProduct(userID, productID, rating);
      // } 
      // catch (err) {
      //   return res.status(400).send(err.message);
      // }

      // ProductModel.rateProduct(userID, productID, rating);
      await this.productRepository.rate(userID, productID, rating);

      return res.status(200).send('Rating has been added');

    } catch (err) {
      console.log(err);
      res.status(400).send("Something went wrong");
    }
  }

  async averagePrice(req, res, next) {
    try {
      const result = await this.productRepository.averageProductPricePerCategory();
      return res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(400).send("Something went wrong");
    }
  }
}
