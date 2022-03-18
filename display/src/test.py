import struct
import board
import busio
import digitalio
import adafruit_rfm9x
import time

# Define radio parameters.
RADIO_FREQ_MHZ = 915.0  # Frequency of the radio in Mhz.

# CircuitPython build:
CS = digitalio.DigitalInOut(board.D16)
RESET = digitalio.DigitalInOut(board.D12)

# Initialize SPI bus.
spi = busio.SPI(clock=board.SCK_1, MOSI=board.MOSI_1, MISO=board.MISO_1)

# Initialze RFM radio
rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, 915.0)

try:
    while True:
        print("Waiting for radio packet")
        packet = rfm9x.receive(keep_listening = False, timeout=5)  # Wait for a packet to be received (up to 0.5 seconds)
        if packet is not None:
#            if (len(packet) == 4):
#                currentRMS = struct.unpack('f', packet)[0]
#                print("Measured current: ", round(currentRMS, 3), "A") 
#            else:
#                print("packet size: ", len(packet))
            packet_text = str(packet, 'ascii')
            print('Received: {0}'.format(packet_text))
            print("packet length: ", len(packet), "packet strength: ", rfm9x.rssi)
        time.sleep(3)

except KeyboardInterrupt:
    print("done")

