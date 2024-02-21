import { View, Button } from "react-native";
import { supabase } from "@/lib/supabase";

const ProfileScreen = () => {
  return (
    <View>
      <Button
        onPress={async () => await supabase.auth.signOut()}
        title="Sign out"
      />
    </View>
  );
};

export default ProfileScreen;
