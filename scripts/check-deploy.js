#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка готовности проекта к деплою...\n');

let hasErrors = false;

// Проверка 1: Существование ключевых файлов
console.log('📋 Проверка ключевых файлов:');
const keyFiles = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'prisma/schema.prisma',
  'app/layout.tsx',
  'app/page.tsx'
];

keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - НЕ НАЙДЕН`);
    hasErrors = true;
  }
});

// Проверка 2: package.json скрипты
console.log('\n🔧 Проверка скриптов в package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['build', 'start', 'dev'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
    } else {
      console.log(`❌ ${script} - НЕ НАЙДЕН`);
      hasErrors = true;
    }
  });
  
  // Проверка зависимостей
  console.log('\n📦 Проверка ключевых зависимостей:');
  const requiredDeps = ['next', 'react', '@prisma/client', 'typescript'];
  
  requiredDeps.forEach(dep => {
    if ((packageJson.dependencies && packageJson.dependencies[dep]) || 
        (packageJson.devDependencies && packageJson.devDependencies[dep])) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - НЕ НАЙДЕН`);
      hasErrors = true;
    }
  });
  
} catch (error) {
  console.log(`❌ Ошибка чтения package.json: ${error.message}`);
  hasErrors = true;
}

// Проверка 3: Prisma схема
console.log('\n🗄️ Проверка Prisma схемы:');
try {
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
  
  if (schema.includes('provider = "postgresql"')) {
    console.log('✅ PostgreSQL провайдер настроен');
  } else {
    console.log('❌ PostgreSQL провайдер не найден');
    hasErrors = true;
  }
  
  if (schema.includes('env("DATABASE_URL")')) {
    console.log('✅ DATABASE_URL переменная используется');
  } else {
    console.log('❌ DATABASE_URL переменная не найдена');
    hasErrors = true;
  }
  
  // Проверка основных моделей
  const requiredModels = ['User', 'Product', 'Category', 'CartItem'];
  requiredModels.forEach(model => {
    if (schema.includes(`model ${model}`)) {
      console.log(`✅ Модель ${model} найдена`);
    } else {
      console.log(`❌ Модель ${model} не найдена`);
      hasErrors = true;
    }
  });
  
} catch (error) {
  console.log(`❌ Ошибка чтения schema.prisma: ${error.message}`);
  hasErrors = true;
}

// Проверка 4: API роуты
console.log('\n🔌 Проверка API роутов:');
const apiRoutes = [
  'app/api/products/route.ts',
  'app/api/cart/route.ts',
  'app/api/auth/login/route.ts',
  'app/api/search/route.ts'
];

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✅ ${route}`);
  } else {
    console.log(`❌ ${route} - НЕ НАЙДЕН`);
    hasErrors = true;
  }
});

// Проверка 5: Компоненты UI
console.log('\n🎨 Проверка UI компонентов:');
const uiComponents = [
  'components/ui/Button.tsx',
  'components/ui/Input.tsx',
  'components/ProductCard.tsx',
  'components/Header.tsx'
];

uiComponents.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} - НЕ НАЙДЕН`);
    hasErrors = true;
  }
});

// Проверка 6: TypeScript конфигурация
console.log('\n⚙️ Проверка TypeScript:');
try {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.baseUrl) {
    console.log('✅ baseUrl настроен');
  } else {
    console.log('⚠️ baseUrl не настроен (рекомендуется)');
  }
  
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
    console.log('✅ Path mapping настроен');
  } else {
    console.log('⚠️ Path mapping не настроен (рекомендуется)');
  }
  
} catch (error) {
  console.log(`❌ Ошибка чтения tsconfig.json: ${error.message}`);
  hasErrors = true;
}

// Итоговый результат
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ ПРОЕКТ НЕ ГОТОВ К ДЕПЛОЮ');
  console.log('Исправьте указанные ошибки перед деплоем.\n');
  process.exit(1);
} else {
  console.log('✅ ПРОЕКТ ГОТОВ К ДЕПЛОЮ!');
  console.log('Можно запускать деплой на Vercel.\n');
  
  console.log('📋 Что делать дальше:');
  console.log('1. Настройте переменные окружения в Vercel (DATABASE_URL, NEXTAUTH_SECRET)');
  console.log('2. Подключите репозиторий к Vercel');
  console.log('3. Запустите деплой');
  console.log('4. Зарегистрируйтесь на сайте - первый пользователь станет админом\n');
  
  process.exit(0);
} 