import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import orders from "@assets/data/orders";
import OrderListItem from "@components/OrderListItem";

export default function MenuScreen() {
  return (
    <View>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
      />
    </View>
  );
}
