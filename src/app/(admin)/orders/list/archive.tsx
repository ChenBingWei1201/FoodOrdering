import { View, FlatList, ActivityIndicator, Text } from "react-native";
// import orders from "@assets/data/orders";
import OrderListItem from "@components/OrderListItem";
import { useAdminOrderList } from "@/api/orders";

export default function OrdersScreen() {
  const {
    data: orders,
    isLoading,
    error,
  } = useAdminOrderList({ archived: true });
  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Fail to fetch</Text>;
  }
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
