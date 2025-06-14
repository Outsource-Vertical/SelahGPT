import React, { useState } from "react";
import { Menu, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@navigation/types";

const HeaderMenu = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [visible, setVisible] = useState(false);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <IconButton icon="dots-vertical" onPress={() => setVisible(true)} />
      }
    >
      <Menu.Item
        onPress={() => navigation.navigate("FitnessProfile", { user: null })}
        title="Fitness"
      />
      <Menu.Item
        onPress={() => navigation.navigate("FaithProfile", { user: null })}
        title="Faith"
      />
      <Menu.Item
        onPress={() => navigation.navigate("FinanceProfile", { user: null })}
        title="Finance"
      />
      <Menu.Item
        onPress={() => navigation.navigate("HealthProfile", { user: null })}
        title="Health"
      />
      <Menu.Item
        onPress={() => navigation.navigate("FamilyProfile", { user: null })}
        title="Family"
      />
    </Menu>
  );
};

export default HeaderMenu;
