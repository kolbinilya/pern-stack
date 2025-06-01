import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
	try {
		const products = await sql`
            SELECT * FROM products
            ORDER BY createdAt DESC
        `;
		console.log("products: ", products);
		res.status(200).json({ success: true, data: products });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: error.message });
	}
};
export const getProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await sql`
        SELECT * FROM products WHERE id = ${id}
        `;

		res.status(200).json({ success: true, data: product[0] });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: error.message });
	}
};
export const createProduct = async (req, res) => {
	try {
		const { name, image, price } = req.body;

		if (!name || !image || !price) {
			return res
				.status(400)
				.json({ success: false, error: "Please provide all fields" });
		}
		const newProduct = await sql`
            INSERT INTO products (name, image, price)
            VALUES (${name}, ${image}, ${price})
            RETURNING *
            `;

		console.log(newProduct);
		res.status(201).json({ success: true, data: newProduct[0] });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: error.message });
	}
};
export const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, image, price } = req.body;
		const updatedProduct = await sql`
        UPDATE products 
        SET name = ${name}, image = ${image}, price = ${price} 
        WHERE id = ${id}
        RETURNING *
        `;

		if (updatedProduct.length === 0) {
			return res
				.status(404)
				.json({ success: false, error: "Product not found" });
		}

		res.status(200).json({ success: true, data: updatedProduct[0] });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: error.message });
	}
};
export const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedProduct = await sql`
            DELETE FROM products WHERE id = ${id}
            RETURNING *
        `;

		if (deletedProduct.length === 0) {
			return res
				.status(404)
				.json({ success: false, error: "Product not found" });
		}

		res.status(200).json({ success: true, data: deletedProduct[0] });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: error.message });
	}
};
