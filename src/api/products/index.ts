import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateTables, Tables, InsertTables } from "@/types";

type Product = Tables<"products">;

// reading all products
export const useProductList = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

// reading products by id
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id) // filter by specific field: id
        .single(); // take the first one instead of an array
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

// add new product
export const useInsertProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: InsertTables<"products">) {
      const { data: newProduct, error } = await supabase
        .from("products")
        .insert({
          name: data.name,
          image: data.image,
          price: data.price,
        });
      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      updatingFields,
    }: {
      id: number;
      updatingFields: UpdateTables<"products">;
    }) {
      const { data: updatedProduct, error } = await supabase
        .from("products")
        .update({
          name: updatingFields.name,
          image: updatingFields.image,
          price: updatingFields.price,
        })
        .eq("id", id)
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return updatedProduct;
    },
    async onSuccess(_, id) {
      await queryClient.invalidateQueries({ queryKey: ["products"] }); // different
      await queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });
};

// delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(id: number) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["products"] }); // different
    },
  });
};
