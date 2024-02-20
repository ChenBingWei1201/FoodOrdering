import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import OrderListItem from "@components/OrderListItem";
import OrderItemListItem from "@components/OrderItemListItem";
import { OrderStatusList } from "@/types";
import Colors from "@constants/Colors";
import { useOrderDetails, useUpdateOrder } from "@/api/orders";

const OrderDetailScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseInt(typeof idString === "string" ? idString : idString[0]);
  const { data: order, isLoading, error } = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();

  const updateStatus = (status: string) => {
    updateOrder({ id, updatedFields: { status } });
  };

  if (!order) {
    return <Text>Order not found</Text>;
  }

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Fail to fetch</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${id}` }} />
      <OrderListItem order={order} />
      <FlatList
        data={order.order_items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OrderItemListItem orderItem={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListFooterComponent={() => (
          <>
            <Text style={{ fontWeight: "bold" }}>Status</Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => updateStatus(status)}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor:
                      order.status === status
                        ? Colors.light.tint
                        : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        order.status === status ? "white" : Colors.light.tint,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    padding: 10,
  },
});

export default OrderDetailScreen;
