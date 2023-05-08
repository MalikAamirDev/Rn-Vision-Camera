import 'react-native-reanimated'
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Camera, useCameraDevices, useFrameProcessor} from 'react-native-vision-camera';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';


const CodeScanner = () => {
  const devices = useCameraDevices();
  const device = devices.front;
  const [permission, setPermission] = useState(false);

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.ALL_FORMATS], {
    checkInverted: true,
  });

  const checkPermissions = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission === 'authorized') setPermission(true);
    if (cameraPermission !== 'authorized') {
      const newCameraPermission = await Camera.requestCameraPermission();
      const status = await Camera.getCameraPermissionStatus();
      if (status === 'authorized') setPermission(true);
      if (status !== 'authorized') {
        alert('PLease allow Camera otherwise you cannot use the Scanner');
        setPermission(false);
      }
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <>
      {device === null || device?.id === undefined || permission === false ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                frameProcessorFps={5}
              />
              {barcodes.map((val, id) => {
                <Text key={id} style={styles.barcodeTextURL}>
                  {val.displayValue}
                </Text>;
              })}
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default CodeScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  innerContainer: {
    height: 300,
    width: 300,
  },
  overlay: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    bottom: '25%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
