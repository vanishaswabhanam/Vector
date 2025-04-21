#include <Wire.h>
#include <Adafruit_BMP280.h>
#include "Arduino_SensorKit.h"
#include <ArduinoJson.h>  // Add this library through Arduino IDE

// I²C address of your BMP280
#define BMP280_ADDR 0x77

// Analog pins on the Sensor Kit shield
#define ROTARY_PIN  A1
#define SOUND_PIN   A2
#define LIGHT_PIN   A3

Adafruit_BMP280 bmp;

void setup() {
  Serial.begin(9600);
  while (!Serial);       // wait for Serial on Leonardo/Micro; safe on Uno

  Wire.begin();

  // Initialize BMP280
  if (!bmp.begin(BMP280_ADDR)) {
    while (1);  // Stop if sensor init failed
  }
  
  delay(100);  // Short delay to ensure stable readings
}

void loop() {
  // 1) Read sensors
  float temperature = bmp.readTemperature();      // in °C
  int rotaryValue  = analogRead(ROTARY_PIN);      // 0–1023
  int soundLevel   = analogRead(SOUND_PIN);       // 0–1023
  int lightLevel   = analogRead(LIGHT_PIN);       // 0–1023

  // 2) Create JSON object
  StaticJsonDocument<200> doc;
  doc["temperature"] = temperature;
  doc["rotation"] = rotaryValue;
  doc["sound"] = soundLevel;
  doc["light"] = lightLevel;

  // 3) Serialize JSON to Serial
  serializeJson(doc, Serial);
  Serial.println();  // Add newline

  delay(1000);  // Wait 1 second
} 