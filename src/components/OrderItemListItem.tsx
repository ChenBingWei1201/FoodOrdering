import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
// import { OrderItem } from "@/types";
import { defaultPizzaImage } from "./ProductListItem";
import { Tables } from "@/database.types";

type OrderItemListItemProps = {
  orderItem: { products: Tables<"products"> | null} & Tables<"order_items">;
};

const OrderItemListItem = ({ orderItem }: OrderItemListItemProps) => {
  if (!orderItem.products) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: orderItem.products.image || defaultPizzaImage }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{orderItem.products.name}</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.price}>
            ${orderItem.products.price.toFixed(2)}
          </Text>
          <Text>Size: {orderItem.size}</Text>
        </View>
      </View>
      <View style={styles.quantitySelector}>
        <Text style={styles.quantity}>{orderItem.quantity}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 75,
    aspectRatio: 1,
    alignSelf: "center",
    marginRight: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: "row",
    gap: 5,
  },
  quantitySelector: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  quantity: {
    fontWeight: "500",
    fontSize: 18,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
});

export default OrderItemListItem;
