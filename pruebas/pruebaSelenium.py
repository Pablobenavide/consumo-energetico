from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys  import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import time

usuario = "Usuario_Prueba1"
correo = "usuarioPrueba4@gmail.com"
contra = "Pruebas12345"

acceso = webdriver.Chrome()

print("Comenzando prieba 1: Registro")
time.sleep(2)
acceso.get("http://localhost:5173/register")

time.sleep(3)

nombre_usuario = acceso.find_element(By.ID, "_r_1_")
email = acceso.find_element(By.ID, "_r_2_")
password = acceso.find_element(By.ID, "_r_3_")

nombre_usuario.send_keys(usuario)
email.send_keys(correo)
password.send_keys(contra)

password.send_keys(Keys.ENTER)

boton_salir = WebDriverWait(acceso, 10).until(
    EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(., 'Salir')]")
    )
)

boton_salir.click()

time.sleep(3)

print("Prueba de registro finalizada....")


time.sleep(2)

print("Comenzado prueba 2: Logueo")
acceso.get("http://localhost:5173/login")

time.sleep(3)

email = acceso.find_element(By.ID, "_r_1_")
password = acceso.find_element(By.ID, "_r_2_")

email.send_keys(correo)
password.send_keys(contra)

password.send_keys(Keys.ENTER)

time.sleep(3)

boton_salir = WebDriverWait(acceso, 10).until(
    EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(., 'Salir')]")
    )
)
boton_salir.click()

print("Prueba de login finalizada....")

time.sleep(2)

print("Comenzando prueba de registro de electrodomestico.")

acceso.get("http://localhost:5173/login")

time.sleep(3)

email = acceso.find_element(By.ID, "_r_1_")
password = acceso.find_element(By.ID, "_r_2_")

email.send_keys(correo)
password.send_keys(contra)

password.send_keys(Keys.ENTER)

time.sleep(2)

electrodomesticos = WebDriverWait(acceso, 10).until(
    EC.element_to_be_clickable(
        (By.XPATH, "//a[contains(text(),'Electrodomésticos')]")
    )
)

electrodomesticos.click()

time.sleep(2)

nuevo_electrodomestico = WebDriverWait(acceso, 10).until(
    EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(., 'Nuevo electrodoméstico')]")
    )
)

nuevo_electrodomestico.click()

time.sleep(2)
elec_nombre = "TV"
consumo = "25"
horas_de_uso = "10"

nombre_electro = WebDriverWait(acceso, 10).until(
    EC.presence_of_element_located(
        (By.XPATH, "//label[text()='Nombre']/following::input[1]")
    )
)
watts = WebDriverWait(acceso, 10).until(
    EC.presence_of_element_located(
        (By.XPATH, "//label[text()='Potencia (watts)']/following::input[1]")
    )
)
tiempo = WebDriverWait(acceso, 10).until(
    EC.presence_of_element_located(
        (By.XPATH, "//label[text()='Horas diarias']/following::input[1]")
    )
)

nombre_electro.send_keys(elec_nombre)
watts.send_keys(consumo)
tiempo.send_keys(horas_de_uso)
nuevo_electrodomestico_guardar = WebDriverWait(acceso, 10).until(
    EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(., 'Guardar')]")
    )
)
nuevo_electrodomestico_guardar.click()

time.sleep(2)

print("Prueba 3 de registro de electrodomestico finalizada....")




