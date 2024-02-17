import { StyleSheet, Text, View, Image } from "react-native";
import products from "@assets/data/products";
import ProductListItem from "@components/ProductListItem";

export default function MenuScreen() {
  return (
    <View>
      <ProductListItem product={products[5]} />
      <ProductListItem product={products[1]} />
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: Color.light.background,
//     padding: 10,
//     borderRadius: 20,
//   },
//   image: {
//     width: "100%",
//     aspectRatio: 1,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginVertical: 10,
//   },
//   price: {
//     color: Color.light.tint,
//     fontWeight: "bold",
//   },
// });
