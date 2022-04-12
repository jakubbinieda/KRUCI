import obd
import time
import json
import math
import board
import busio
import datetime
import adafruit_lis3dh
import adafruit_si7021

connection = obd.OBD()

if hasattr(board, "ACCELEROMETER_SCL"):
    i2c = busio.I2C(board.ACCELEROMETER_SCL, board.ACCELEROMETER_SDA)
    lis3dh = adafruit_lis3dh.LIS3DH_I2C(i2c, address=0x19)
else:
    i2c = busio.I2C(board.SCL, board.SDA)
    lis3dh = adafruit_lis3dh.LIS3DH_I2C(i2c)

lis3dh.range = adafruit_lis3dh.RANGE_16_G
si7021 = adafruit_si7021.SI7021(board.I2C())

consumptionConst = 8.464601346
totalSpeed = 0
totalRPM = 0
totalConsumption = 0
t = 0

data = {
    'startTime': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    'distTraveled': 'n/a',
    'fuelConsumpt': 'n/a',
    'engineLoad': 'n/a',
    'coolantTemp': 'n/a',
    'consumption': 'n/a',
    'averageSpeed': 'n/a',
    'averageRPM': 'n/a',
    'averageCons': 'n/a',
    'speed': 'n/a',
    'temperature': 'n/a',
    'humidity': 'n/a',
    'acceleration': 'n/a'
}

while True:
    if(t==0): print("git")
    coolantTemp = connection.query(obd.commands.COOLANT_TEMP).value.magnitude
    tempSpeed = connection.query(obd.commands.SPEED).value.magnitude
    tempRPM = connection.query(obd.commands.RPM).value.magnitude
    engineLoad = connection.query(obd.commands.ENGINE_LOAD).value.magnitude
    MAF = connection.query(obd.commands.MAF).value.magnitude

    tempSpeed*=5
    tempSpeed/=18

    if tempSpeed!=0 :
        tempConsumption = MAF/tempSpeed*consumptionConst
    else :
        tempConsumption = 0
    
    totalSpeed += tempSpeed
    totalRPM += tempRPM
    totalConsumption += tempConsumption

    if t!=0 :
        averSpeed = totalSpeed/t
        averRPM = totalRPM/t
        averConsumption = totalConsumption/t
    else :
        averSpeed = 0
        averRPM = 0
        averConsumption = 0

    distTraveled = averSpeed*t
    fuelConsumpt = distTraveled*averConsumption/100000
    
    x, y, z = [
        value / adafruit_lis3dh.STANDARD_GRAVITY for value in lis3dh.acceleration
    ]

    data['distTraveled'] = distTraveled
    data['fuelConsumpt'] = fuelConsumpt
    data['engineLoad'] = engineLoad
    data['coolantTemp'] = coolantTemp
    data['consumption'] = tempConsumption
    data['averageSpeed'] = averSpeed*18/5
    data['averageRPM'] = averRPM
    data['averageCons'] = averConsumption
    data['speed'] = tempSpeed*18/5
    data['temperature'] = si7021.temperature
    data['humidity'] = si7021.relative_humidity
    data['acceleration'] = math.sqrt(x**2+y**2)

    with open('/home/pi/Desktop/Kruci/public/diagnostics.txt', 'w') as outfile:
        json.dump(data, outfile)   
            
    time.sleep(1)

    t += 1 
