# Проверки функций планирования

Запуск из корня проекта на macOS (Swift и JavaScriptCore входят в инструменты разработчика):

```sh
swift -module-cache-path /tmp/vkadre-test-cache tests/run.swift
```

Проверяет фильтры, статусы откликов, перенос и отмену, синхронизацию календаря, откат при ошибках сохранения, напоминания и безопасное отображение ссылок.

Проверка интерфейса в WebKit при работающем локальном сервере на `http://127.0.0.1:8001/`:

```sh
swift -module-cache-path /tmp/vkadre-test-cache tests/browser.swift
```

Использует отдельное хранилище WebKit с уникальным идентификатором, очищаемое после теста: пользовательские данные не изменяются. Проверяет сценарий от объявления до договорённости, загрузку изображения, задачи, отмену, напоминания и мобильную ширину. Снимок экрана записывается в `/tmp/vkadre-preview-390.png`.

Проверка переработанного интерфейса на заданной ширине (например, 320, 390, 768 или 1280 px):

```sh
swift -module-cache-path /tmp/vkadre-test-cache tests/browser.swift 390 tests/interface.test.js
```

Проверяет страницы и формы без горизонтального переполнения, расположение шапки, календарь в профиле, отсутствие создания предложений съёмки, создание записи календаря, сохранение предпочтений Pro, тему, загрузку фото и кадрирование. Снимок записывается в `/tmp/vkadre-preview-390.png` (число соответствует выбранной ширине).

Основной браузерный тест использует специально созданную архивную карточку предложения только для проверки совместимости с ранее сохранёнными данными. Новое создание предложений по актуальному ТЗ проверяется отдельными тестами shoots.


Первый этап нового ТЗ:

```sh
swift -module-cache-path /tmp/vkadre-test-cache tests/shoots-run.swift
swift -module-cache-path /tmp/vkadre-test-cache tests/browser.swift 390 tests/shoots-browser.test.js http://127.0.0.1:8001/ tests/shoots-reload.test.js
```

Драйвер принимает ширину, файл сценария, URL и необязательный сценарий после реальной перезагрузки. Для проверки GitHub Pages использован локальный сервер с подпапкой `/wkadre/`; тот же набор прошёл на ширине 1280 px. Микрофон не автоматизируется: проверяется сохранение и отрисовка тестового WAV-вложения, без заявления о проверке живой записи.


Этап 2: `tests/run.swift` также выполняет `tests/castings.test.js`.
Подготовленный, пока не исполненный браузерный сценарий:

```sh
swift -module-cache-path /tmp/vkadre-test-cache tests/browser.swift 390 tests/castings-browser.test.js http://127.0.0.1:8001/
swift -module-cache-path /tmp/vkadre-test-cache tests/browser.swift 1280 tests/castings-browser.test.js http://127.0.0.1:8002/wkadre/
```

Проверка загрузки изображений и настоящей перезагрузки для объявлений пока ручная (см. docs/DEVELOPMENT.md).


Этап 4: `tests/run.swift` выполняет `tests/workspace.test.js`. Браузерный сценарий подготовлен, но не исполнен:

```sh
swift -module-cache-path /tmp/vkadre-test-cache tests/browser.swift 390 tests/workspace-browser.test.js http://127.0.0.1:8001/
```

Загрузку изображения, перезагрузку и личные вложения после этапа 4 проверить отдельно.

Stage 5: `tests/run.swift` includes `tests/profile-work.test.js`.
Prepared, not executed:

```sh
swift -module-cache-path /tmp/vkadre-test-cache tests/browser.swift 390 tests/profile-work-browser.test.js http://127.0.0.1:8001/
```

Existing photos, a real reload and desktop widths still require browser verification.

Stage 6: `tests/run.swift` includes `tests/discovery.test.js`.
Prepared browser scenario (not executed):

```sh
swift -module-cache-path /tmp/vkadre-test-cache tests/browser.swift 390 tests/discovery-browser.test.js http://127.0.0.1:8001/
```

Test real reload, desktop layouts and attachments separately during final regression.
