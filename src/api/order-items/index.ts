import { supabase } from "@/lib/supabase";
import { InsertTables } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const useInsertOrderItems = () => {
  return useMutation({
    async mutationFn(data: InsertTables<"order_items">[]) {
      const { error, data: items } = await supabase
        .from("order_items")
        .insert(data)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return items;
    },
  });
};
