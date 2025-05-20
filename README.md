6. Авторизация
7. Удаление своих файлов 


# Хостинг файлов



# Основные концепции
Сервис реализован на nodejs, в качестве БД используется файловая система. HTTPS запросы на сервер принимает nginx, после чего проксирует поток на nodejs сервер используя http.



# Заказ VPS
Можно заказать VPS (Virtual Personal Server) на многих площадках, я использовал [firstvds](https://firstvds.ru/).

Минимальные ресурсы:
- 1x cpu;
- 1Gb RAM;
- 10Gb SSD (возможно больше, если планируется хранение большого количества объемных файлов).

Данная инструкция написана для `Debian 12`, но в целом нет большой разницы ubuntu/centos или других nix-систем.

После установки, выдается IP-адрес и пароль для ssh доступа.
Плюс к этому, fvds выдает технический домен (в моем случае `grigorchuk.konstantin.fvds.ru`).

К VPS на выданный IP можно настроить любой купленный домен.

# Настройка окружения



## Настройка HTTPS (SSL cert bot)
Для работы через защищенный протокол https (а не через небезопасный http), нужно создать и установить SSL сертификат на вашем сервере.
Есть возможность сделать это бесплатно используя cert bot. Для fvds есть [статья](https://firstvds.ru/technology/besplatnyy-ssl-sertifikat), помогающая сделать это.

```bash
apt update
apt install certbot python3-certbot-nginx
```

Необходимо указать домен
```bash
mcedit /etc/nginx/sites-available/default
```

Необходимо найти строку начинающуюся с `server_name` (где-то 46 строка)
Было `server_name _;` нудно поменять на `server_name grigorchuk.konstantin.fvds.ru;` (если необходимо использовать www `server_name grigorchuk.konstantin.fvds.ru www.grigorchuk.konstantin.fvds.ru;`). Потом `F2` для сохранения `F10` для выхода из редактора.

Проверяем, что конфигурация сервера в порядке
```bash
nginx -t
```

Перезапускем nginx с новыми параметрами
```bash
systemctl reload nginx
```

```bash
certbot --nginx -d grigorchuk.konstantin.fvds.ru
# Если хотите использовать www
#certbot --nginx -d grigorchuk.konstantin.fvds.ru -d www.grigorchuk.konstantin.fvds.ru
```
Если комманда выполняется впервые - потребуется указать email, для служебных рассылок

После этого попробуйте открыть `https://grigorchuk.konstantin.fvds.ru`, должна открыться страницы с текстом `Welcome to nginx!`.



## Настройка "проброса" запросов из сети интернет в наше приложение
Нужно сделать наше приложеник (которое пока не запущено) доступным из сети интернет.
Для этого нужно сконфигурировать nginx, что бы он входящие запросы перенаправлял на наш web-сервер.

Для этого откройте файл конфигурации `nginx`

```bash
mcedit /etc/nginx/sites-available/default
```

Необходимо найти блок начинающийся с `location /` (где-то 46 строка). Блок скорее всего будет выглядеть как-то так
```
location / {
    # First attempt to serve request as file, then
    # as directory, then fall back to displaying a 404.
    try_files $uri $uri/ =404;
}
```

Замените содержимое этого блока, чтобы получилось так, как показано ниже

```
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_redirect     off;
    proxy_set_header   Host             $host;
    proxy_set_header   X-Real-IP        $remote_addr;
    proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
}
```
Проверяем, что конфигурация сервера в порядке
```bash
nginx -t
```

Перезапускем nginx с новыми параметрами
```bash
systemctl reload nginx
```

Проверить пока не получится, т.к. приложение еще не поднято



## Установка git-клиента

```bash
apt install git
```

Проверяем, что git установился и нормально работает
```bash
git -v
```



## Установка nodejs
Для установки nodejs проще всего использовать [nvm](https://github.com/nvm-sh/nvm)

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

После установки необходимо перезагрузить ОС. После перезагрузки необходимо выполнить комманду
```bash
nvm -v
```
Если все хорошо, то будет выведена версия nvm.

Устанавливаем nodejs 20 версии (можно 22 версию)
```bash
nvm install 20
```

После этого проверяем, что nodejs нормально работает
```bash
node -v
# Выведет, например v20.19.1
npm -v
# Выведет, например 10.8.2
```



## Установка pm2

Необходимо установить сервис перезапуска nodejs-процессов pm2
```bash
npm i -g pm2
```
После этого комманда
```bash
pm2 ls
```
выведет пустую таблицу запущенных приложений. Пока это нормально.

После этого нужно настроить автоматический перезапуск pm2 при рестарте сервера
```bash
pm2 startup
```



# Выкачивание и запуск проекта

Разместить код на VPS можно через выкачивание из GITа, или просто скопировав файлы через предпочитаемый файловый менеджер

## Копирование кода на VPS

```bash
cd /opt
```

Выкачивание кода из репозитория
```bash
git clone https://github.com/MikeAlekseev/Hosting.git
```

Необходимо будет указать логин/пароль, либо [сгененрировать SSH ключ](https://docs.github.com/ru/authentication/connecting-to-github-with-ssh).
Я просто скопировал исходный код, чтоб файл `package.json` был доступен по пути `/opt/Hosting/package.json`



## Сборка проекта

Компилируем проект
```bash
cd /opt/Hosting
npm ci
npm run build
```



## Указание переменных сред

Нужно создать `.env` файл

Внимание! После `SESSION_SECRET=` нужно написать любую случайную строку 5-10 символов/цифр. Это ядро шифрования сессий пользователей

```bash
echo -e "SESSION_SECRET=\n" > .env
```



## Пробный запуск приложения

```bash
npm run start
```

Должны пойти логи, где будет написано "Server started on http://0.0.0.0:8080"
Это значит, что пробный заапуск прошел успещно. Завершаем процесс `Ctrl+C`



## Production запуск

Теперь нужно запустить приложение под надзором `pm2`

```bash
pm2 start ecosystem.config.cjs
pm2 ls
```

В таблице должна была появиться строка с нашим приложением `file-hosting`

Теперь, нужно сохранить список запущенных приложения, чтоб `pm2` при перезапуске восстановил их

```bash
pm2 save
```

После этого открываем браузер по ссылке https://grigorchuk.konstantin.fvds.ru и откроется окно авторизации, куда вводим логин/пароль созданного ранее пользователя.
Возможно откроется закешированная "заглушка" nginx'а, для исправления нажмите в браузере `Ctrl+Shift+R`, для перезагрузки без кеша.



# Обновление и перезапуск

Останавливаем `pm2` процесс

```bash
pm2 stop file-hosting
```

Обновляем код, после чего компиляция и перезапуск

```bash
cd /opt/Hosting
npm ci
npm run build
pm2 restart file-hosting
```
