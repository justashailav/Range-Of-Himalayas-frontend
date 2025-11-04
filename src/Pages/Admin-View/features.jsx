import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { createGalleryItem } from "@/store/slices/gallerySlice";

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    category: "",
    title: "",
    desc: "",
    images: [],
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.gallery);

  // ✅ Handle submit
  const handleSubmit = async () => {
    if (!form.category || !form.title || !form.images.length) {
      alert("Category, Title, and at least 1 image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("category", form.category);
    formData.append("title", form.title);
    formData.append("desc", form.desc);

    // ✅ Append multiple images
    form.images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await dispatch(createGalleryItem(formData));
      alert("Gallery item created successfully!");
      setForm({ category: "", title: "", desc: "", images: [] });
      setOpen(false);
    } catch (error) {
      alert(error || "Failed to add gallery item");
    }
  };

  return (
    <div className="p-6">
      {/* Trigger Button */}
      <Button onClick={() => setOpen(true)}>Add Gallery Item</Button>

      {/* Popup Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Gallery Item</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Category Select */}
            <select
              className="w-full border rounded-md p-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="Orchard">Orchard</option>
              <option value="Harvesting">Harvesting</option>
              <option value="Products">Products</option>
              <option value="Farm">Farm</option>
            </select>

            {/* Title */}
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            {/* Description */}
            <textarea
              placeholder="Description"
              rows={3}
              className="w-full border rounded-md p-2"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />

            {/* Images Upload */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, images: Array.from(e.target.files) })
              }
            />

            {/* ✅ Safe Preview */}
            {Array.isArray(form.images) && form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {form.images.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
