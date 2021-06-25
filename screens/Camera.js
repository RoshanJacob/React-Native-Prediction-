import * as React from "react";
import { Button, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class OpenCam extends React.Component {
  // constructor() {
  //   this.state = {
  //     image: "null",
  //   };
  // }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button onPress={this.pickImage} title="Click this to pick an image!" />
      </View>
    );
  }

  pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        // this.setState({
        //   image: result.data, // Three different key values inside the result.data : uri, cancelled, height, width...,
        // });

        this.uploadImage(result.uri);
      }
    } catch (Exception) {
      console.log(Exception);
    }
  };

  uploadImage = async (uri) => {
    const data = new FormData();

    let fileName = uri.split("/")[uri.split("/").length - 1];
    let fileType = `image/${uri.split(".")[uri.split(".").length - 1]}`;

    const fileToUpload = {
      uri: uri,
      name: fileName,
      type: fileType,
    };

    data.append("digit", fileToUpload);

    fetch("https://77b9fc3534c5.ngrok.io/post-image", {
      method: "POST",
      body: data,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => {
        response.json();
      })
      .then((result) => {
        console.log("success", result);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  componentDidMount() {
    this.getCameraPermissions();
  }

  getCameraPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== "granted") {
        alert(
          "Sorry! We really do need camera permissions for this app to work."
        );
      }
    }
  };
}
