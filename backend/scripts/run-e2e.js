#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Función para esperar un puerto
function waitForPort(port, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    function check() {
      const { spawn } = require('child_process');
      const netstat = spawn('netstat', ['-an']);
      let output = '';

      netstat.stdout.on('data', (data) => {
        output += data.toString();
      });

      netstat.on('close', () => {
        if (output.includes(`:${port}`)) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Puerto ${port} no disponible después de ${timeout}ms`));
        } else {
          setTimeout(check, 1000);
        }
      });
    }

    check();
  });
}

async function runE2ETests() {
  try {
    // 1. Iniciar el backend
    console.log('Iniciando servidor backend...');
    const backend = spawn('npm', ['start'], {
      cwd: process.cwd(),
      stdio: 'pipe',
      shell: true
    });
    
    // 2. Iniciar el frontend
    console.log('Iniciando servidor frontend...');
    const frontend = spawn('python', ['-m', 'http.server', '8080'], {
      cwd: path.join(process.cwd(), '..', 'frontend'),
      stdio: 'pipe',
      shell: true
    });
    
    // 3. Esperar a que los servidores estén listos
    await Promise.all([
      waitForPort(3000),
      waitForPort(8080)
    ]);
    
    console.log('Esperando inicialización completa...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 4. Ejecutar las pruebas
    console.log('Ejecutando pruebas E2E...');
    const playwrightProcess = spawn('npx', ['playwright', 'test', '--reporter=list'], {
      stdio: 'inherit',
      shell: true
    });
    
    playwrightProcess.on('close', (code) => {
      console.log('\nLimpiando procesos...');
      backend.kill();
      frontend.kill();
      
      if (code === 0) {
        console.log('Pruebas E2E completadas exitosamente!');
        process.exit(0);
      } else {
        console.log('Algunas pruebas E2E fallaron.');
        process.exit(code);
      }
    });
    
  } catch (error) {
    console.error('Error ejecutando pruebas E2E:', error.message);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.log('\nInterrumpido por usuario');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nTerminado');
  process.exit(0);
});

runE2ETests();