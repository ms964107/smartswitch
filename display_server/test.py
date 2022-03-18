import pcf8574_io
import time

# You can use up to 8 PCF8574 boards
# the board will start in input mode
# the pins are HIGH in input mode
clk = pcf8574_io.PCF(0x24)
dt = pcf8574_io.PCF(0x24)

# p0 to p7 are the pins name
# INPUT or OUTPUT is the mode
clk.pin_mode("p3", "INPUT")
dt.pin_mode("p4", "INPUT")
counter = 0
clkLastState = clk.read("p3")
try:
    while True:
        clkState = clk.read("p3")
        dtState  = dt.read("p4")
        # print(clkState, dtState)
        if clkState != clkLastState:
            if dtState != clkState:
                    counter += 1
                    print('right')
            else:
                    counter -= 1
                    print('left')
            # if (counter % 5 == 0): print(counter/5)
        print('clkState: ' + str(clkState) + '; dtState: ' + str(dtState))
        # print(dtState)
        clkLastState = clkState
        time.sleep(0.1)
except KeyboardInterrupt:
    print("done")
