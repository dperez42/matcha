import os
import json
import random
import mysql.connector
import datetime
import pandas as pd

mydb = mysql.connector.connect(
  host="localhost",
  user="user",
  password="password",
  database="matcha_db"
)

print(mydb)
cursor = mydb.cursor()
cursor.execute("SELECT * FROM users")

result = cursor.fetchall()

if __name__ == '__main__':
    
    data = pd.read_csv("dim_municipios.csv", sep=";")
    municipios = pd.DataFrame(data)
    print(municipios.head())

    table ='users'
    with open("random_users.json") as archivo:
            datos=json.load(archivo)
    i = 0
    #print(datos["results"][0])
    #exit()
    while (i < len(datos["results"])-1):
        #print(i,datos["results"][i]["name"])
        try:

            date_str = datos["results"][i]["dob"]["date"][0:18]
            date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S')
            print("date:", date_obj)
            #print(datos["results"][i]["location"]["coordinates"]["longitude"])
            #munici = municipios.sample(n=1)
            #print(municipios.loc[0,['lon','lat']])
            muni = municipios.loc[random.randint(0,4000),['municipio','provincia','lon','lat']]
            print(muni)
            #print(munici.describe())
            #muni = munici.loc[0,'lon']
            #print(muni.loc[0,'lon'])
            #print(muni)
            insert_query = """INSERT INTO """ + table + """ (`uuid`,`username`,`password`,`email`,`avatar`,`rating`,`date`,`address`,`title`,`first`,`last`,`zip`,`phone`,`cell`,`nat`,`gender`,`city`,`state`,`country`,`longitude`,`latitude`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
            cursor.execute(insert_query,(datos["results"][i]["login"]["uuid"],
                datos["results"][i]["login"]["username"],'$2b$10$FmOL5MxEi.v9rvigMYmAOOrMgDXxyCfLrUfDB9LSRy1G0O9DIjIae',datos["results"][i]["email"],datos["results"][i]["picture"]["large"],random.randrange(start=5),date_obj,\
                datos["results"][i]["location"]["street"]["name"]+','+str(datos["results"][i]["location"]["street"]["number"]),
                datos["results"][i]["name"]["title"],datos["results"][i]["name"]["first"],datos["results"][i]["name"]["last"],'99999',datos["results"][i]["phone"],datos["results"][i]["cell"],datos["results"][i]["nat"],
                datos["results"][i]["gender"],muni['municipio'],muni['provincia'],'Spain',float(muni['lon']),float(muni['lat'])
            ))
            mydb.commit()
            result = cursor.fetchall()
            i = i+1
            #print(result,datos["results"][i])
        except Exception as error:
            print(i,".Error:", error)
            i=i+1
    #try:

    #    sql_insert_query = """INSERT INTO """ + table + """ ("id","PNRCode","Origin", "Destination", "CheckInNumber_UCA", "Compartment", "NumberOfSegments_UCA", "WorkstationName_UCA","seatNumber", "Eticket_UCA", "PaxStatus_UCA", "PassengerHash_UCA", "Terminal_UCA","Tipo_UCA","Gate_UCA","numVue", "flightdate_UCA", "LastScanTime_UCA","Count_CK","Count_AK","Count_GT", "flightDate") VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s)"""

    #    cursor.execute(sql_insert_query,(json_object["after"]["Id"], pnrcode,origin.replace(" ",""),destination.replace(" ",""), checkinnumber, json_object["after"]["Compartment"], json_object["after"]["NumberOfSegments"], json_object["after"]["WorkstationName"].replace("0",""), json_object["after"]["SeatNumber"][0:4].replace("0",""), str(json_object["after"]["ETicketIndicator"]), str(json_object["after"]["PaxStatus"]), str(json_object["after"]["PassengerHash"]), json_object["after"]["WorkstationName"][3:5],tipo_lector,json_object["after"]["WorkstationName"][7:11],airlineid.replace(" ","")+flightnumber.replace(" ",""),flightdate,dates,AK,CK,GT,date_obj2))

    #except Exception as error:

    #    print(".Error:", error)

 