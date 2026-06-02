import { expect, test } from '@playwright/test';

function uniqueEmail(prefix) {
  return `${prefix}.${Date.now()}@energyhome.com`;
}

test('registro completo de usuario', async ({ page }) => {
  const email = uniqueEmail('register');

  await page.goto('/register');
  await page.getByLabel('Nombre').fill('Usuario Registro');
  await page.getByLabel('Correo').fill(email);
  await page.getByLabel('Contraseña').fill('Password123!');
  await page.getByRole('button', { name: 'Registrar cuenta' }).click();

  await expect(page.getByText('Bienvenido al panel energético')).toBeVisible();
});

test('inicio de sesión y creación de electrodoméstico', async ({ page }) => {
  const email = uniqueEmail('login');

  await page.goto('/register');
  await page.getByLabel('Nombre').fill('Usuario Login');
  await page.getByLabel('Correo').fill(email);
  await page.getByLabel('Contraseña').fill('Password123!');
  await page.getByRole('button', { name: 'Registrar cuenta' }).click();
  await page.getByRole('button', { name: 'Salir' }).click();

  await page.goto('/login');
  await page.getByLabel('Correo').fill(email);
  await page.getByLabel('Contraseña').fill('Password123!');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await expect(page.getByText('Bienvenido al panel energético')).toBeVisible();

  await page.getByRole('link', { name: 'Electrodomésticos' }).click();
  await page.getByRole('button', { name: 'Nuevo electrodoméstico' }).click();
  await page.getByLabel('Nombre').fill('Aire acondicionado');
  await page.getByLabel('Potencia (watts)').fill('1200');
  await page.getByLabel('Horas diarias').fill('4');
  await page.getByRole('button', { name: 'Guardar' }).click();

  await expect(page.getByText('Aire acondicionado')).toBeVisible();
});

test('visualización del dashboard', async ({ page }) => {
  const email = uniqueEmail('dashboard');

  await page.goto('/register');
  await page.getByLabel('Nombre').fill('Usuario Dashboard');
  await page.getByLabel('Correo').fill(email);
  await page.getByLabel('Contraseña').fill('Password123!');
  await page.getByRole('button', { name: 'Registrar cuenta' }).click();

  await expect(page.getByText('Consumo total')).toBeVisible();
  await expect(page.getByText('Consumo por electrodoméstico')).toBeVisible();
  await expect(page.getByText('Consumo mensual')).toBeVisible();
  await expect(page.getByText('Historial de consumo')).toBeVisible();
});