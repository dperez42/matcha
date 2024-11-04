import pandas as pd

municipios = pd.read_csv("dim_municipios.csv", sep=";")
print(municipios.head())

print(muni['lon'])