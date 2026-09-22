import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ButtonCancel, ButtonCss } from "@/components/common/ButtonCss";
import {
  CATEGORY_LIST,
  CREATE_CATEGORY,
  CREATE_SUB_CATEGORY,
  CREATE_VENDOR,
  FETCH_SUB_CATEGORY,
  SUB_FETCH_CATEGORY,
} from "@/pages/api/UseApi";

const inputCss: string =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all";

interface CategoryOption {
  id: string | number;
  category_name: string;
}

interface SubCategoryOption {
  id: string | number;
  category_sub_name: string;
}

const getErrorMsg = (err: any, fallback: string): string =>
  err?.response?.data?.msg || err?.data?.msg || fallback;

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------

interface QuickAddCategoryFormProps {
  onCreated: (categoryName: string) => void;
  onClose: () => void;
}

export const QuickAddCategoryForm: React.FC<QuickAddCategoryFormProps> = ({
  onCreated,
  onClose,
}) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const name = categoryName.trim();
    if (!name) {
      toast.error("Please enter a category name.");
      return;
    }
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("category_name", name);
      if (image) formData.append("categories_images", image);

      const res: any = await CREATE_CATEGORY(formData);
      if (res?.data?.code === 200) {
        toast.success(res.data.msg || "Category created successfully");
        onCreated(name);
      } else {
        toast.error(res?.data?.msg || "Failed to create category");
      }
    } catch (err: any) {
      toast.error(getErrorMsg(err, "Failed to create category"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form autoComplete="off" onSubmit={onSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className={inputCss}
            placeholder="Enter Category Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image <span className="text-xs text-gray-400">(optional)</span>
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className={inputCss}
          />
        </div>
      </div>
      <div className="flex justify-end mt-6 space-x-3">
        <button type="button" onClick={onClose} className={ButtonCancel}>
          Cancel
        </button>
        <button type="submit" disabled={saving} className={ButtonCss}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

// ---------------------------------------------------------------------------
// Sub Category
// ---------------------------------------------------------------------------

interface QuickAddSubCategoryFormProps {
  categories: CategoryOption[];
  initialCategoryId?: string;
  onCreated: (subCategoryName: string, categoryId: string) => void;
  onClose: () => void;
}

export const QuickAddSubCategoryForm: React.FC<
  QuickAddSubCategoryFormProps
> = ({ categories, initialCategoryId = "", onCreated, onClose }) => {
  const [categoryId, setCategoryId] = useState<string>(initialCategoryId);
  const [subName, setSubName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    setCategoryId(initialCategoryId);
  }, [initialCategoryId]);

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const name = subName.trim();
    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }
    if (!name) {
      toast.error("Please enter a sub category name.");
      return;
    }
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("category_id", categoryId);
      formData.append("category_sub_name", name);
      if (image) formData.append("categories_sub_images", image);

      const res: any = await CREATE_SUB_CATEGORY(formData);
      if (res?.data?.code === 200) {
        toast.success(res.data.msg || "Sub category created successfully");
        onCreated(name, categoryId);
      } else {
        toast.error(res?.data?.msg || "Failed to create sub category");
      }
    } catch (err: any) {
      toast.error(getErrorMsg(err, "Failed to create sub category"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form autoComplete="off" onSubmit={onSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-700">*</span>
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputCss}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((option) => (
              <option key={option.id} value={String(option.id)}>
                {option.category_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub Category Name <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            className={inputCss}
            placeholder="Enter Sub Category Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image <span className="text-xs text-gray-400">(optional)</span>
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className={inputCss}
          />
        </div>
      </div>
      <div className="flex justify-end mt-6 space-x-3">
        <button type="button" onClick={onClose} className={ButtonCancel}>
          Cancel
        </button>
        <button type="submit" disabled={saving} className={ButtonCss}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

// ---------------------------------------------------------------------------
// Vendor (compact inline creation used by the Spot Rate form)
// ---------------------------------------------------------------------------

export interface CreatedVendor {
  id?: string;
  vendor_name: string;
  vendor_mobile: string;
}

interface QuickAddVendorFormProps {
  /** Fixed trader value (e.g. "3" for Spot Rates). Hidden when provided. */
  defaultTrader?: string;
  onCreated: (vendor: CreatedVendor) => void;
  onClose: () => void;
}

const traderOptions: { value: string; label: string }[] = [
  { value: "1", label: "Live" },
  { value: "2", label: "Rates" },
  { value: "3", label: "Spot Rates" },
];

export const QuickAddVendorForm: React.FC<QuickAddVendorFormProps> = ({
  defaultTrader = "",
  onCreated,
  onClose,
}) => {
  const [vendorName, setVendorName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [trader, setTrader] = useState<string>(defaultTrader);
  const [subCategory, setSubCategory] = useState<string>("");
  const [product, setProduct] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [rate, setRate] = useState<string>("0");

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [subcategories, setSubCategories] = useState<SubCategoryOption[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  // Categories for the inline vendor form (same source as the Rates flow,
  // with a fallback to the Master flow endpoint).
  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const response: any = await CATEGORY_LIST();
        const list = response?.data?.category ?? [];
        if (Array.isArray(list) && list.length > 0) {
          setCategories(list);
          return;
        }
        const fallback: any = await SUB_FETCH_CATEGORY();
        setCategories(fallback?.data?.category ?? []);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Sub categories depend on the selected category name (backend resolves
  // sub categories by category name, matching the Rates/Vendor forms).
  useEffect(() => {
    const fetchSubCategories = async (): Promise<void> => {
      if (!category) {
        setSubCategories([]);
        return;
      }
      try {
        const response: any = await FETCH_SUB_CATEGORY(category);
        setSubCategories(response?.data?.categorySub ?? []);
      } catch (error: any) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategories();
  }, [category]);

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        vendor_name: vendorName.trim(),
        vendor_mobile: mobile.trim(),
        vendor_email: email.trim(),
        vendor_city: city.trim(),
        vendor_address: address.trim(),
        vendor_category: category,
        vendor_no_of_products: 1,
        vendor_trader: trader,
        vendorProduct_sub_data: [
          {
            vendor_product_category_sub: subCategory,
            vendor_product: product.trim(),
            vendor_product_size: size.trim(),
            vendor_product_rate: rate,
          },
        ],
      };
      const res: any = await CREATE_VENDOR(payload);
      if (res?.data?.code === 200) {
        const createdId =
          res?.data?.vendor?.id ??
          res?.data?.data?.id ??
          res?.data?.id ??
          res?.data?.vendor_id ??
          undefined;
        toast.success(res.data.msg || "Vendor created successfully");
        onCreated({
          id: createdId != null ? String(createdId) : undefined,
          vendor_name: payload.vendor_name,
          vendor_mobile: payload.vendor_mobile,
        });
      } else {
        toast.error(res?.data?.msg || "Failed to create vendor");
      }
    } catch (err: any) {
      toast.error(getErrorMsg(err, "Failed to create vendor"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form autoComplete="off" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendor Name <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            className={inputCss}
            placeholder="Enter Vendor Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className={inputCss}
            placeholder="Enter Mobile"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-700">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCss}
            placeholder="Enter Email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputCss}
            placeholder="Enter City"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputCss}
            placeholder="Enter Address"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-700">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory("");
            }}
            className={inputCss}
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((option) => (
              <option key={option.id} value={option.category_name}>
                {option.category_name}
              </option>
            ))}
          </select>
        </div>
        {!defaultTrader && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trader <span className="text-red-700">*</span>
            </label>
            <select
              value={trader}
              onChange={(e) => setTrader(e.target.value)}
              className={inputCss}
              required
            >
              <option value="" disabled>
                Select Trader
              </option>
              {traderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub Category <span className="text-red-700">*</span>
          </label>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className={inputCss}
            required
          >
            <option value="" disabled>
              Select Sub Category
            </option>
            {subcategories.map((option) => (
              <option key={option.id} value={option.category_sub_name}>
                {option.category_sub_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className={inputCss}
            placeholder="Enter Product Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className={inputCss}
            placeholder="Enter Size"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate <span className="text-red-700">*</span>
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className={inputCss}
            placeholder="Enter Rate"
            required
          />
        </div>
      </div>
      <div className="flex justify-end mt-6 space-x-3">
        <button type="button" onClick={onClose} className={ButtonCancel}>
          Cancel
        </button>
        <button type="submit" disabled={saving} className={ButtonCss}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};
