
import pcf8574_io
import time
import websockets
import asyncio

# You can use up to 8 PCF8574 boards
# the board will start in input mode
# the pins are HIGH in input mode
power_button = pcf8574_io.PCF(0x20)
enter_button = pcf8574_io.PCF(0x20)
back_button  = pcf8574_io.PCF(0x20)
f1_button    = pcf8574_io.PCF(0x20)
f2_button    = pcf8574_io.PCF(0x20)

clk = pcf8574_io.PCF(0x24)
dt = pcf8574_io.PCF(0x24)


# p0 to p7 are the pins name
# INPUT or OUTPUT is the mode
power_button.pin_mode("p1", "INPUT")
enter_button.pin_mode("p3", "INPUT")
back_button.pin_mode("p5", "INPUT")
f1_button.pin_mode("p6", "INPUT")
f2_button.pin_mode("p7", "INPUT")
clk.pin_mode("p3", "INPUT")
dt.pin_mode("p4", "INPUT")

async def echo(websocket):
    print("call echo")
    counter = 0
    clkLastState = clk.read("p3")
    async for message in websocket:
        while True:
            if (not power_button.read("p1")):
                print("power button pressed")
            # elif (not enter_button.read("p3")):
            #     print("enter button pressed")
            #     time.sleep(0.5)
            #     await websocket.send("return")
            elif (not back_button.read("p5")):
                print("space button pressed")
                time.sleep(0.5)
                await websocket.send("space")
            elif (not f1_button.read("p6")):
                print("f1 button pressed")
                time.sleep(0.5)
                await websocket.send("ArrowLeft")
            elif (not f2_button.read("p7")):
                print("f2 button pressed")
                time.sleep(0.5)
                await websocket.send("ArrowRight")
            clkState = clk.read("p3")
            dtState  = dt.read("p4")
            # print(clkLastState, clkState, dtState)
            if clkState != clkLastState:
                if dtState != clkState:
                    counter += 1
                    if (counter % 5 == 0):
                        print('rotary right')
                        await websocket.send("ArrowUp")
                else:
                    counter -= 1
                    if (counter % 5 == 0):
                        print('rotary left')
                        await websocket.send("ArrowDown")
                # print(counter)
            # print('clkState: ' + str(clkState) + '; dtState: ' + str(dtState))
            clkLastState = clkState
            time.sleep(0.01)

async def main():
    print('start server')
    async with websockets.serve(echo, "localhost", 9898):
        await asyncio.Future()  # run forever

asyncio.run(main())
