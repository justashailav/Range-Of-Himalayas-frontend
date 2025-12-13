import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  getAllProduct,
  deleteProduct,
  editProduct,
} from "@/store/slices/productSlice";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductTile from "@/components/Admin-View/product-tile";
import { toast } from "react-toastify";

const WEIGHTS = [
  "250g",
  "500g",
  "750g",
  "1kg",
  "2kg",
  "3kg",
  "5kg",
  "10kg",
  "12kg",
  "15kg",
];

export default function Adminproducts() {
  const dispatch = useDispatch();
  const { productList, error, message } = useSelector((state) => state.products);

  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const [product, setProduct] = useState({
    title: "",
    description: "",
    nutrition: {},
    details: {},
    badges: ["Bestseller", "Organic"],
    images: [],
    variants: [
      {
        size: "", // 👈 EMPTY for dry fruits
        weight: "250g",
        stock: 0,
        price: 0,
        salesPrice: 0,
      },
    ],
  });

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      setOpenCreateProductDialog(false);
      setCurrentEditedId(null);
      resetForm();
      dispatch(getAllProduct());
    }
    if (error) toast.error(error);
  }, [message, error, dispatch]);

  const resetForm = () => {
    setProduct({
      title: "",
      description: "",
      nutrition: {},
      details: {},
      badges: ["Bestseller", "Organic"],
      images: [],
      variants: [
        {
          size: "",
          weight: "250g",
          stock: 0,
          price: 0,
          salesPrice: 0,
        },
      ],
    });
  };

  // ---------------- HANDLERS ----------------

  const handleChange = (e) =>
    setProduct({ ...product, [e.target.name]: e.target.value });

  const handleVariantChange = (index, field, value) => {
    const updated = product.variants.map((v, i) =>
      i === index
        ? {
            ...v,
            [field]: ["stock", "price", "salesPrice"].includes(field)
              ? Number(value)
              : value,
          }
        : v
    );
    setProduct({ ...product, variants: updated });
  };

  const addVariant = () => {
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        { size: "", weight: "250g", stock: 0, price: 0, salesPrice: 0 },
      ],
    });
  };

  const removeVariant = (index) => {
    setProduct({
      ...product,
      variants: product.variants.filter((_, i) => i !== index),
    });
  };

  const handleImagesChange = (e) =>
    setProduct({
      ...product,
      images: [...product.images, ...Array.from(e.target.files)],
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      if (key === "variants") {
        formData.append("variants", JSON.stringify(product.variants));
      } else if (key === "images") {
        product.images.forEach((img) => formData.append("images", img));
      } else {
        formData.append(key, product[key]);
      }
    });

    currentEditedId
      ? dispatch(editProduct({ id: currentEditedId, formData }))
      : dispatch(addProduct(formData));
  };

  // ---------------- JSX ----------------

  return (
    <Fragment>
      <Button
        onClick={() => setOpenCreateProductDialog(true)}
        className="mb-6 bg-[#F08C7D]"
      >
        <Plus size={16} /> Add Product
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productList.map((p) => (
          <ProductTile
            key={p._id}
            product={p}
            handleDelete={(id) => dispatch(deleteProduct(id))}
            setCurrentEditedId={() => {
              setCurrentEditedId(p._id);
              setProduct({ ...p, images: [] });
              setOpenCreateProductDialog(true);
            }}
            setOpenCreateProductDialog={setOpenCreateProductDialog}
          />
        ))}
      </div>

      <Dialog open={openCreateProductDialog} onOpenChange={setOpenCreateProductDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentEditedId ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="title"
              placeholder="Product title"
              value={product.title}
              onChange={handleChange}
              className="w-full border p-2"
              required
            />

            <textarea
              name="description"
              placeholder="Product description"
              value={product.description}
              onChange={handleChange}
              className="w-full border p-2"
            />

            {/* VARIANTS */}
            <div>
              <h3 className="font-semibold mb-2">Weights & Prices</h3>
              {product.variants.map((v, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 mb-2">
                  {/* Size OPTIONAL */}
                  <select
                    value={v.size}
                    onChange={(e) => handleVariantChange(i, "size", e.target.value)}
                    className="border p-2"
                  >
                    <option value="">No Size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>

                  <select
                    value={v.weight}
                    onChange={(e) => handleVariantChange(i, "weight", e.target.value)}
                    className="border p-2"
                  >
                    {WEIGHTS.map((w) => (
                      <option key={w}>{w}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) => handleVariantChange(i, "stock", e.target.value)}
                    className="border p-2"
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    value={v.price}
                    onChange={(e) => handleVariantChange(i, "price", e.target.value)}
                    className="border p-2"
                  />

                  <input
                    type="number"
                    placeholder="Sale"
                    value={v.salesPrice}
                    onChange={(e) =>
                      handleVariantChange(i, "salesPrice", e.target.value)
                    }
                    className="border p-2"
                  />
                </div>
              ))}

              <Button type="button" onClick={addVariant}>
                + Add Weight
              </Button>
            </div>

            <input type="file" multiple onChange={handleImagesChange} />

            <Button type="submit" className="w-full bg-[#F08C7D]">
              Save Product
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
