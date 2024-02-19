import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { defaultPizzaImage } from "@/components/ProductListItem";
import { useState } from "react";
import { useCart } from "@/providers/CartProvider";
import type { PizzaSize } from "@/types";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useProduct } from "@/api/products";

// const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const ProductDetailScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseInt(typeof idString === "string" ? idString : idString[0]);
  const { data: product, error, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

  const addToCart = () => {
    if (!product) return;
    addItem(product, selectedSize);
    router.push("/cart");
  };

  if (!product) {
    return (
      <View>
        <Text style={{ fontSize: 20 }}>Product Not Found</Text>
      </View>
    );
  }

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Fail to fetch product</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Menu",
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen options={{ title: product.name }} />

      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
      />

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    // marginTop: "auto",
  },
});

export default ProductDetailScreen;
