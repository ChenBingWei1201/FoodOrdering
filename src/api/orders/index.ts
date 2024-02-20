import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { InsertTables, Order, Product, Tables, UpdateTables } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// reading all orders
export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ["Delivered"] : ["New", "Cooking", "Delivering"];

  return useQuery({
    queryKey: ["orders", { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", statuses)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

// reading user's orders
export const useMyOrderList = () => {
  const { session } = useAuth(); // get authenticated user
  const id = session?.user.id;

  return useQuery({
    queryKey: ["orders", { user_id: id }],
    queryFn: async () => {
      if (!id) {
        return null;
      }
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

// reading orders by id
export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("id", id) // filter by specific field: id
        .single(); // take the first one instead of an array
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

// user can create a new order
export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth(); // get authenticated user
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: InsertTables<"orders">) {
      const { data: newOrder, error } = await supabase
        .from("orders")
        .insert({ ...data, user_id: userId })
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return newOrder;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateTables<"orders">;
    }) {
      const { data: updatedOrder, error } = await supabase
        .from("orders")
        .update(updatedFields)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return updatedOrder;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["orders"] }); // different
      await queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },
  });
};

// export const useDeleteProduct = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     async mutationFn(id: number) {
//       const { error } = await supabase.from("products").delete().eq("id", id);
//       if (error) {
//         throw new Error(error.message);
//       }
//     },
//     async onSuccess() {
//       await queryClient.invalidateQueries({ queryKey: ["products"] }); // different
//     },
//   });
// };
