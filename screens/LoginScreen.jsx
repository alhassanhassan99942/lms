import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ marginTop: 50 }}>
        <Image
          style={{ width: 150, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 20 }}>
            Login to Your Account{" "}
          </Text>
        </View>

        <View style={{ marginTop: 40 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderColor: "D0D0D0D",
              borderWidth: 1,
              paddingVertical: 2,
              borderRadius: 5,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChange={(text) => setEmail(text)}
              style={{ color: "gray", marginVertical: 10, width: 300,fontSize: email?16:16  }}
              placeholder="enter your email"
            />
          </View>
        </View>

        <View style={{ marginTop: 30 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderColor: "D0D0D0D",
              borderWidth: 1,
              paddingVertical: 2,
              borderRadius: 5,
            }}
          >
            <AntDesign
              style={{ marginLeft: 8 }}
              name="lock"
              size={24}
              color="gray"
            />
            <TextInput
              value={password}
              onChange={(text) => setPassword(text)}
              style={{ color: "gray", marginVertical: 10, width: 300, fontSize: password?16:16 }}
              placeholder="enter your password"
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 12,
          }}
        >
          <Text>Keep me logged in</Text>
          <Text style={{ fontWeight: "500", color: "#007FFF" }}>
            Forgot Password
          </Text>
        </View>

        <View style={{marginTop: 45}} /> 

        <Pressable style={{width: 200, backgroundColor: 'black', padding: 15, marginTop: 40, marginLeft: 'auto', marginRight: 'auto', borderRadius:6, }}>
            <Text style={{textAlign:'center', color: 'white', fontSize: 16}}>Login</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Register') } style={{marginTop: 10}}>
            <Text style={{textAlign: 'center', fontSize: 16}}>Don't have an Account Sign up</Text>
        </Pressable>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
