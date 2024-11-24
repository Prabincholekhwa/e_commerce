import { ProductInterface } from '../database/interfaces';
import { productRepository } from '../database/repositories/productRepository';
const productService = {
  async addProduct(data: ProductInterface[]) {
    try {
      const newAddedProducts: ProductInterface[] = [];
      const stockUpdatedProducts: ProductInterface[] = [];
      await Promise.all(
        data.map(async (product) => {
          const doesProductExist = await productRepository.findByProductId({
            id: product.product_id,
          });

          if (doesProductExist) {
            // Update stock for existing product
            const [affectedRows] = await productRepository.updateStock({
              product_id: product.product_id,
              count: product.stock,
              isIncrement: true,
            });
            stockUpdatedProducts.push(...affectedRows);
          } else {
            // Add to the list of new products
            newAddedProducts.push(product);
          }
        })
      );
      // Bulk insert the new products, if any
      if (newAddedProducts.length > 0) {
        await productRepository.bulkInsert(newAddedProducts);
        return { newAddedProducts, stockUpdatedProducts };
      }
      return { newAddedProducts, stockUpdatedProducts };
    } catch (e) {
      throw e;
    }
  },

  async getAllProducts() {
    try {
      return await productRepository.find();
    } catch (e) {
      throw e;
    }
  },
};
export default productService;
