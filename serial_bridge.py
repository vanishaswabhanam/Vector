import serial
import json
import requests
import time

# Configure the serial connection
SERIAL_PORT = '/dev/cu.usbmodem1201'  # Change this to match your Arduino's port
BAUD_RATE = 9600
SERVER_URL = 'http://localhost:3001/api/sensor-data'

def main():
    try:
        # Open serial port
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE)
        print(f"Connected to Arduino on {SERIAL_PORT}")
        
        while True:
            if ser.in_waiting:
                # Read line from serial
                line = ser.readline().decode('utf-8').strip()
                
                try:
                    # Parse JSON data
                    data = json.loads(line)
                    
                    # Send to server
                    response = requests.post(SERVER_URL, json=data)
                    if response.status_code == 200:
                        print("Data sent successfully:", data)
                    else:
                        print("Failed to send data:", response.status_code)
                        
                except json.JSONDecodeError:
                    print("Failed to parse JSON:", line)
                except requests.RequestException as e:
                    print("Failed to send data to server:", e)
                    
            time.sleep(0.1)  # Small delay to prevent CPU overuse
            
    except serial.SerialException as e:
        print(f"Failed to connect to Arduino: {e}")
    except KeyboardInterrupt:
        print("\nExiting...")
    finally:
        if 'ser' in locals():
            ser.close()

if __name__ == "__main__":
    main() 