const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const serviceAccount = require('./service-account.json');

// Инициализация приложения
initializeApp({
    credential: cert(serviceAccount)
});

// Токен вашего React Native устройства
// const registrationToken = 'ВАШ_FCM_ТОКЕН_УСТРОЙСТВА';

const message = {
    notification: {
        title: 'Тест приватного ключа',
        body: 'Успешно отправлено через модульный Firebase Admin SDK!'
    },
    // нужен либо token, либо topic
    // token: registrationToken
    topic: 'all'
};

// Отправка через современный метод getMessaging()
getMessaging().send(message)
    .then((response) => {
        console.log('Успешно отправлено:', response);
        process.exit(0);
    })
    .catch((error) => {
        console.error('Ошибка отправки:', error);
        process.exit(1);
    });
