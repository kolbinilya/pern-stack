import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL =
	import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useProductStore = create((set, get) => ({
	products: [],
	isLoading: false,
	error: null,
	currentProduct: null,

	formData: {
		name: "",
		image: "",
		price: "",
	},

	setFormData: (formData) => set({ formData }),
	resetForm: () => set({ formData: { name: "", image: "", price: "" } }),

	addProduct: async (e) => {
		e.preventDefault();
		set({ isLoading: true });
		try {
			const { formData } = get();
			await axios.post(`${BASE_URL}/api/products`, formData);
			await get().fetchProducts();
			get().resetForm();
			document.getElementById("add_product_modal").close();
			toast.success("Product added successfully");
		} catch (error) {
			console.log(error);
			toast.error("Failed to add product");
		} finally {
			set({ isLoading: false });
		}
	},

	fetchProducts: async () => {
		set({ isLoading: true });
		try {
			const response = await axios.get(`${BASE_URL}/api/products`);
			set({ products: response.data.data, error: null });
		} catch (error) {
			set({ error: error.message, products: [] });
		} finally {
			set({ isLoading: false });
		}
	},

	deleteProduct: async (id) => {
		set({ isLoading: true });
		try {
			await axios.delete(`${BASE_URL}/api/products/${id}`);
			set((prev) => ({
				products: prev.products.filter((product) => product.id !== id),
				error: null,
			}));
			toast.success("Product deleted successfully");
		} catch (error) {
			set({ error: error.message, products: [] });
			toast.error("Failed to delete product");
		} finally {
			set({ isLoading: false });
		}
	},
	fetchProduct: async (id) => {
		set({ loading: true });
		try {
			const response = await axios.get(`${BASE_URL}/api/products/${id}`);
			set({
				currentProduct: response.data.data,
				formData: response.data.data, // pre-fill form with current product data
				error: null,
			});
		} catch (error) {
			console.log("Error in fetchProduct function", error);
			set({ error: "Something went wrong", currentProduct: null });
		} finally {
			set({ loading: false });
		}
	},
	updateProduct: async (id) => {
		set({ loading: true });
		try {
			const { formData } = get();
			const response = await axios.put(
				`${BASE_URL}/api/products/${id}`,
				formData
			);
			set({ currentProduct: response.data.data });
			toast.success("Product updated successfully");
		} catch (error) {
			toast.error("Something went wrong");
			console.log("Error in updateProduct function", error);
		} finally {
			set({ loading: false });
		}
	},
}));
