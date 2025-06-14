import React, { useLayoutEffect } from "react";
import HeaderMenu from "../src/components/HeaderMenu";

export default function withHeaderMenu(Component) {
  return function WrappedComponent(props) {
    const { navigation, route } = props;
    const user = route?.params?.user;

    useLayoutEffect(() => {
      if (navigation && user) {
        navigation.setOptions({
          headerRight: () => <HeaderMenu navigation={navigation} user={user} />,
        });
      }
    }, [navigation, user]);

    return <Component {...props} />;
  };
}
